import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key_modeon_build_only", {
  apiVersion: "2026-06-24.dahlia",
});

interface CheckoutSessionParams {
  userId: string;
  items: {
    productId: string;
    variantId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }[];
  shippingAddressId: string;
  billingAddressId: string;
  couponCode?: string;
  tax: number;
  shippingFee: number;
}

export async function createStripeCheckoutSession(params: CheckoutSessionParams) {
  try {
    const lineItems = params.items.map((item) => ({
      price_data: {
        currency: "inr", // default INR pricing format
        product_data: {
          name: `${item.name} (${item.color} / ${item.size})`,
          images: [item.image.startsWith("http") ? item.image : `${process.env.NEXTAUTH_URL || "http://localhost:3000"}${item.image}`],
        },
        unit_amount: Math.round(item.price * 100), // stripe accepts paisa/cents
      },
      quantity: item.quantity,
    }));

    // Add shipping line if applicable
    if (params.shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Express Shipping & Handling",
            images: [],
          },
          unit_amount: Math.round(params.shippingFee * 100),
        },
        quantity: 1,
      });
    }

    // Add tax line if applicable
    if (params.tax > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Estimated Goods and Services Tax (GST)",
            images: [],
          },
          unit_amount: Math.round(params.tax * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout/failed`,
      metadata: {
        userId: params.userId,
        shippingAddressId: params.shippingAddressId,
        billingAddressId: params.billingAddressId,
        couponCode: params.couponCode || "",
        items: JSON.stringify(params.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        })))
      },
    });

    return { sessionId: session.id, url: session.url };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe Checkout Session Error:", err);
    throw new Error(errorMessage);
  }
}
