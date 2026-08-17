import { httpResource } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Product } from '../../../core/models/product.model';
import { environment } from '../../../../environments/environment.development';
import { Spinner } from "../../../shared/ui/spinner/spinner";
import { Card } from "../../../shared/ui/card/card";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [Spinner, Card, CurrencyPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
   /**
   * Populated AUTOMATICALLY from the route's :id segment — this is
   * withComponentInputBinding() (Phase 0) doing its job. No
   * ActivatedRoute injection, no .paramMap.subscribe() anywhere in
   * this class — the route param arrives as a plain signal input,
   * exactly like any other input() would.
   */
  id = input.required<string>();

  /**
   * ⚠️ NOTE THE TYPE HERE: ApiResponse<Product>, NOT Product directly
   * — unlike the LIST endpoint in Phase 3 Step 2 (which returns a raw
   * Page<Product> with no envelope), GET /api/v1/products/{id}
   * (Phase E, File 4's getById()) wraps its response in the standard
   * ApiResponse envelope, same as every other single-resource endpoint
   * across this entire backend. Getting this distinction wrong is an
   * easy, very real bug — the response WOULD arrive successfully, but
   * product() below would silently try to read fields off the wrong
   * object shape.
   */
  protected productResource = httpResource<ApiResponse<Product>>(
    () => `${environment.apiUrl}/api/v1/products/${this.id()}`
  );

  // Unwraps the envelope ONCE, here, so the template just works with
  // a plain Product | undefined — the ApiResponse wrapper is an
  // HTTP-layer concern that shouldn't leak into the template itself.
  protected product = computed(() => this.productResource.value()?.data);
}
