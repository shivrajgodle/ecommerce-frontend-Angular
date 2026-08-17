export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface ShippingAddressRequest {
  street: string; city: string; state: string; zipCode: string; country: string;
}
export interface CheckoutRequest {
  shippingAddress: ShippingAddressRequest;
}
export interface OrderResponse {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdDate: string;
}

// NEW — Phase 6 additions
export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}
export interface ShippingAddressResponse {
  street: string; city: string; state: string; zipCode: string; country: string;
}
export interface OrderDetailResponse {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdDate: string;
  cancellationReason: string | null;
  shippingAddress: ShippingAddressResponse;
  items: OrderItemResponse[];
}