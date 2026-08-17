export interface CartItemResponse {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    priceSnapshot: number;
    subtotal: number;
}

export interface CartResponse {
    id: number;
    userId: number;
    items: CartItemResponse[];
    cartTotal: number;
}