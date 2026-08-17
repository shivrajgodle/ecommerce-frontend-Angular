export interface ReviewResponse {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdDate: string;
}

export interface RatingSummaryResponse {
  productId: number;
  averageRating: number;
  reviewCount: number;
}

export interface ReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

export interface ReviewUpdateRequest {
  rating: number;
  comment: string;
}