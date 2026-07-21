import { Order, OrderItem } from "@/types/order";
import { SavedAddress } from "@/types/user";

/**
 * Service to manage e-commerce checkout orders.
 * Emulates REST API endpoints for placing guest and user selections.
 */
export const OrderService = {
  async createOrder(orderInput: {
    userId: string | null;
    guestEmail: string | null;
    totalAmount: number;
    addressId: string | null;
    guestAddress: Partial<SavedAddress> | null;
    items: Array<{ variantId: string; quantity: number; priceAtPurchase: number }>;
  }): Promise<Order> {
    // Generate a random stable uuid prefix
    const orderId = `ord-${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const items: OrderItem[] = orderInput.items.map((item, idx) => ({
      id: `${orderId}-item-${idx}`,
      orderId,
      variantId: item.variantId,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
    }));

    const newOrder: Order = {
      id: orderId,
      userId: orderInput.userId,
      guestEmail: orderInput.guestEmail,
      status: "confirmed", // Default confirmed status as per checkout confirmed flows
      totalAmount: orderInput.totalAmount,
      addressId: orderInput.addressId,
      guestAddress: orderInput.guestAddress,
      items,
      createdAt: now,
      updatedAt: now,
    };

    // Return the generated order representation wrapped in a Promise (emulating network response)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newOrder);
      }, 500); // 500ms network emulation lag
    });
  },
};
