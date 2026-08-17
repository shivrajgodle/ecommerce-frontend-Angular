import { Component, ChangeDetectionStrategy, input, inject, signal, computed } from '@angular/core';
import { StarRatingComponent } from '../../shared/ui/star-rating/star-rating.component';
import { Button } from '../../shared/ui/button/button';
import { Card } from '../../shared/ui/card/card';
import { AuthStore } from '../../core/services/auth-store';
import { ReviewService } from '../../core/services/review.service';
import { ToastService } from '../../shared/ui/toast/toast-service';
import { httpResource } from '@angular/common/http';
import { ApiResponse } from '../../core/models/api-response.model';
import { RatingSummaryResponse, ReviewResponse } from '../../core/models/review.model';
import { environment } from '../../../environments/environment.development';
import { PageResponse } from '../../core/models/page.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review-section',
  imports: [StarRatingComponent, Button, Card, DatePipe],
  templateUrl: './review-section.html',
  styleUrl: './review-section.scss',
})
export class ReviewSection {
  productId = input.required<number>();

  protected authStore = inject(AuthStore);
  private reviewService = inject(ReviewService);
  private toast = inject(ToastService);

  private page = signal(0);

  protected summaryResource = httpResource<ApiResponse<RatingSummaryResponse>>(
    () => `${environment.apiUrl}/api/v1/reviews/product/${this.productId()}/summary`,
  );
  protected summary = computed(() => this.summaryResource.value()?.data);
  protected roundedAverage = computed(() => Math.round(this.summary()?.averageRating ?? 0));

  protected reviewsResource = httpResource<PageResponse<ReviewResponse>>(() => ({
    url: `${environment.apiUrl}/api/v1/reviews/product/${this.productId()}`,
    params: { page: this.page(), size: 5, sort: 'createdDate,desc' },
  }));

  /**
   * ⚠️ HONEST LIMITATION, worth flagging rather than hiding: this only
   * finds the current user's review if it happens to fall on the
   * CURRENTLY LOADED page (5 most recent reviews). A user who reviewed
   * a very popular product long ago, now buried on page 4, would see
   * "Write a review" instead of "Edit your review" here — a real,
   * minor UX rough edge. A fully correct version would need a
   * dedicated backend endpoint (GET /reviews/product/{id}/mine) —
   * genuinely worth adding if this were a production app, deliberately
   * left as a known simplification for this learning build rather than
   * silently pretending it's fully solved.
   */
  protected ownReview = computed(() => {
    const userId = this.authStore.currentUser()?.userId;
    if (!userId) return null;
    return this.reviewsResource.value()?.content.find((r) => r.userId === userId) ?? null;
  });

  protected showForm = signal(false);
  protected formRating = signal(0);
  protected formComment = signal('');
  protected submitting = signal(false);

  startReview() {
    const existing = this.ownReview();
    this.formRating.set(existing?.rating ?? 0);
    this.formComment.set(existing?.comment ?? '');
    this.showForm.set(true);
  }

  async submitReview() {
    if (this.formRating() < 1) {
      this.toast.error('Please select a star rating');
      return;
    }
    this.submitting.set(true);
    try {
      const existing = this.ownReview();
      if (existing) {
        await this.reviewService.update(existing.id, {
          rating: this.formRating(),
          comment: this.formComment(),
        });
        this.toast.success('Review updated');
      } else {
        await this.reviewService.create({
          productId: this.productId(),
          rating: this.formRating(),
          comment: this.formComment(),
        });
        this.toast.success('Review posted');
      }
      this.showForm.set(false);
      this.reviewsResource.reload();
      this.summaryResource.reload();
    } catch {
      // errorInterceptor already surfaced the specific failure —
      // including, notably, the 409 from Review Service's composite
      // unique constraint (Phase J) if this race-conditioned into a
      // genuine duplicate somehow slipping past the ownReview() check
      // above.
    } finally {
      this.submitting.set(false);
    }
  }

  async deleteReview(reviewId: number) {
    await this.reviewService.delete(reviewId);
    this.toast.success('Review deleted');
    this.reviewsResource.reload();
    this.summaryResource.reload();
  }

  // Mirrors Review Service's OWN authorization rule exactly (Phase J):
  // owner OR admin. This is a UI-layer CONVENIENCE — hiding a button
  // someone isn't allowed to use — not a security boundary. The real
  // enforcement is, correctly, still entirely on the backend; a
  // network tab manipulation attempting DELETE on someone else's
  // review would still get a clean 403 regardless of what this method
  // decides to render.
  canDelete(review: ReviewResponse): boolean {
    const userId = this.authStore.currentUser()?.userId;
    return review.userId === userId || this.authStore.isAdmin();
  }
}
