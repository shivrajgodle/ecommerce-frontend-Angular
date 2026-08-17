import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { ReviewRequest, ReviewResponse, ReviewUpdateRequest } from '../models/review.model';

/**
 * Same reasoning as OrderService (Phase 5): reading review lists and
 * the rating summary is REACTIVE fetching (httpResource, directly in
 * the component that needs it) — but creating, editing, and deleting
 * a review are one-shot mutations, which belong here.
 */
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);

  async create(request: ReviewRequest): Promise<ReviewResponse> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ReviewResponse>>(`${environment.apiUrl}/api/v1/reviews`, request)
    );
    return response.data;
  }

  async update(reviewId: number, request: ReviewUpdateRequest): Promise<ReviewResponse> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<ReviewResponse>>(`${environment.apiUrl}/api/v1/reviews/${reviewId}`, request)
    );
    return response.data;
  }

  async delete(reviewId: number): Promise<void> {
    await firstValueFrom(
      this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/api/v1/reviews/${reviewId}`)
    );
  }
}