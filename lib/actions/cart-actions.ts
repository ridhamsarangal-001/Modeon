"use server";

import { db } from "@/lib/services/db";
import { auth } from "@/auth";

export async function syncCartAction(localItems: { productId: string; variantId: string; quantity: number }[]) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const userId = session.user.id;

    for (const item of localItems) {
      await db.cartItem.upsert({
        where: {
          userId_variantId: {
            userId,
            variantId: item.variantId,
          },
        },
        update: {
          quantity: { increment: item.quantity },
        },
        create: {
          userId,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        },
      });
    }

    // Fetch full synced cart from DB to return to client
    const synced = await db.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { media: true }
        },
        variant: true,
      },
    });

    const items = synced.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      name: item.product.name,
      size: item.variant.size,
      color: item.variant.color,
      image: item.product.media[0]?.url || "/assets/images/collections/men-essentials.jpg",
      price: item.product.basePrice * (1 - item.product.discountPercent / 100),
      quantity: item.quantity,
      slug: item.product.slug,
    }));

    return { success: true, items };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sync failed";
    console.error("Cart sync error:", err);
    return { success: false, error: msg };
  }
}

export async function addToCartAction(productId: string, variantId: string, quantity: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Not logged in" };

    const userId = session.user.id;

    // Check inventory
    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.quantity < quantity) {
      return { success: false, error: "Insufficient inventory available." };
    }

    await db.cartItem.upsert({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        variantId,
        quantity,
      },
    });

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Addition failed";
    console.error("Add to cart error:", err);
    return { success: false, error: msg };
  }
}

export async function updateCartQuantityAction(variantId: string, quantity: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Not logged in" };

    const userId = session.user.id;

    if (quantity <= 0) {
      await db.cartItem.delete({
        where: {
          userId_variantId: {
            userId,
            variantId,
          },
        },
      });
    } else {
      await db.cartItem.update({
        where: {
          userId_variantId: {
            userId,
            variantId,
          },
        },
        data: { quantity },
      });
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Update failed";
    console.error("Update cart error:", err);
    return { success: false, error: msg };
  }
}

export async function removeFromCartAction(variantId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Not logged in" };

    const userId = session.user.id;

    await db.cartItem.delete({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
    });

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Removal failed";
    console.error("Remove cart error:", err);
    return { success: false, error: msg };
  }
}

export async function clearCartAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    await db.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("Clear cart error:", err);
    return { success: false };
  }
}
