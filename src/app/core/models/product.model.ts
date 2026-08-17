export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  active: boolean;
  categoryName: string;
  tags: string[];
}