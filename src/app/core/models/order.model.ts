export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface ShippingAddressRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
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