import { SavedAddress } from "./user";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string | null; // Nullable for guest checkout
  guestEmail: string | null;
  status: OrderStatus;
  totalAmount: number;
  addressId: string | null; // Nullable if address stored inline for guests
  guestAddress: Partial<SavedAddress> | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
