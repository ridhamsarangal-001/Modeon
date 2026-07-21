"use server";

import { db } from "@/lib/services/db";
import { createClient } from "@/lib/supabase/server";

// Helper: get current user's Prisma ID via Supabase session
async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const prismaUser = await db.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  return prismaUser?.id ?? null;
}

export async function syncWishlistAction(localProductIds: string[]) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    for (const pId of localProductIds) {
      await db.wishlistItem.upsert({
        where: {
          userId_productId: {
            userId,
            productId: pId,
          },
        },
        update: {},
        create: {
          userId,
          productId: pId,
        },
      });
    }

    const items = await db.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { media: true },
        },
      },
    });

    return {
      success: true,
      productIds: items.map((item) => item.productId),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sync failed";
    console.error("Wishlist sync error:", err);
    return { success: false, error: msg };
  }
}

export async function toggleWishlistAction(productId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "Not logged in" };

    const existing = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await db.wishlistItem.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      return { success: true, wishlisted: false };
    } else {
      await db.wishlistItem.create({
        data: {
          userId,
          productId,
        },
      });
      return { success: true, wishlisted: true };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Toggle failed";
    console.error("Toggle wishlist error:", err);
    return { success: false, error: msg };
  }
}
