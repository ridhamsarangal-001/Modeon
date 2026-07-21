import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/services/stripe";
import { db } from "@/lib/services/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Verification failed";
    console.error(`Webhook signature verification failed:`, errorMsg);
    return new NextResponse(`Webhook Error: ${errorMsg}`, { status: 400 });
  }

  // Handle standard payment webhook events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const metadata = session.metadata;
    if (!metadata) {
      return new NextResponse("Metadata missing", { status: 400 });
    }

    interface WebhookItem {
      productId: string;
      variantId: string;
      quantity: number;
      price: number;
    }
    const { userId, shippingAddressId, billingAddressId, couponCode, items } = metadata;
    const parsedItems = JSON.parse(items) as WebhookItem[];

    try {
      // Begin database atomic transaction
      await db.$transaction(async (tx) => {
        // 1. Calculate discount if coupon exists
        let couponId: string | undefined;
        let discountPercent = 0;

        if (couponCode) {
          const coupon = await tx.coupon.findUnique({
            where: { code: couponCode, isActive: true, expiresAt: { gt: new Date() } }
          });
          if (coupon) {
            couponId = coupon.id;
            discountPercent = coupon.discountPercent;
          }
        }

        const rawTotal = parsedItems.reduce((acc: number, item) => acc + item.price * item.quantity, 0);
        const discountAmount = rawTotal * (discountPercent / 100);
        const tax = (rawTotal - discountAmount) * 0.18; // 18% GST standard
        const shippingFee = rawTotal > 15000 ? 0 : 450; // free express shipping above 15k
        const finalPrice = rawTotal - discountAmount + tax + shippingFee;

        // 2. Create Order record
        await tx.order.create({
          data: {
            userId,
            shippingAddressId,
            billingAddressId,
            couponId,
            totalPrice: finalPrice,
            tax,
            shippingFee,
            discountAmount,
            stripeSessionId: session.id,
            status: "processing", // success, processing, shipped
            items: {
              create: parsedItems.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price
              }))
            },
            statusHistory: {
              create: [
                { status: "pending", message: "Order placed successfully." },
                { status: "processing", message: "Payment verified by Stripe. Preparing parcel." }
              ]
            }
          }
        });

        // 3. Decrement Inventory quantities
        for (const item of parsedItems) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId }
          });

          if (!variant || variant.quantity < item.quantity) {
            throw new Error(`Insufficient inventory available for variant: ${item.variantId}`);
          }

          const nextQuantity = variant.quantity - item.quantity;
          const status = nextQuantity === 0 ? "sold_out" : nextQuantity < 3 ? "low_stock" : "in_stock";

          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              quantity: nextQuantity,
              status
            }
          });
        }

        // 4. Clear Customer's Cart DB items since payment has been completed
        await tx.cartItem.deleteMany({
          where: { userId }
        });
      });

      console.log(`Order processed successfully for Session: ${session.id}`);
      return NextResponse.json({ received: true, success: true });
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "Transaction failed";
      console.error("Order creation transaction error:", e);
      return new NextResponse(`Transaction Error: ${errorMsg}`, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
