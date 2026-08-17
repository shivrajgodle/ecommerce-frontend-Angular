import { httpResource } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { PageResponse } from '../../../core/models/page.model';
import { Product } from '../../../core/models/product.model';
import { environment } from '../../../../environments/environment.development';
import { Category } from '../../../core/models/category.model';
import { Spinner } from "../../../shared/ui/spinner/spinner";
import { Card } from "../../../shared/ui/card/card";
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

const PAGE_SIZE = 12;

 interface ApiEnvelope<T> {
  data: T;
  message: string;
  status: number;
  timestamp: string;
}
@Component({
  selector: 'app-product-list',
  imports: [Spinner, Card, RouterLink, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  // The RAW text box value, updated on every keystroke.
  protected keywordInput = signal('');

  // The DEBOUNCED value that actually feeds the HTTP request — only
  // updates 400ms after the user stops typing. Deliberately hand-rolled
  // with setTimeout rather than reaching for a signal-debounce helper —
  // this pattern is simple, and I'd rather show you something I'm
  // certain is correct than a brand-new utility whose exact signature
  // I can't verify with full confidence at this point in Angular 22's
  // life.
  protected keyword = signal('');
  private debounceHandle?: ReturnType<typeof setTimeout>;

  protected categoryId = signal<number | null>(null);
  protected minPrice = signal<number | null>(null);
  protected maxPrice = signal<number | null>(null);
  protected page = signal(0);

  onKeywordInput(value: string) {
    this.keywordInput.set(value);
    clearTimeout(this.debounceHandle);
    this.debounceHandle = setTimeout(() => {
      this.page.set(0); // ANY filter change resets to page 0 — staying on page 4 of a NEW, smaller result set makes no sense
      this.keyword.set(value);
    }, 400);
  }

  onCategoryChange(value: string) {
    this.categoryId.set(value ? Number(value) : null);
    this.page.set(0);
  }

  onMinPriceChange(value: string) {
    this.minPrice.set(value ? Number(value) : null);
    this.page.set(0);
  }

  onMaxPriceChange(value: string) {
    this.maxPrice.set(value ? Number(value) : null);
    this.page.set(0);
  }
 /**
   * THE CORE PATTERN: the function passed to httpResource() reads
   * page(), keyword(), categoryId(), minPrice(), maxPrice() — every
   * signal it reads becomes a DEPENDENCY. Change ANY of them (type a
   * search term, pick a category, click "Next page"), and httpResource
   * automatically fires a NEW request with the recomputed params — no
   * manual subscribe(), no switchMap(), no explicit "refetch" call
   * anywhere. This directly replaces what would have been a fairly
   * involved RxJS combineLatest/switchMap pipeline in older Angular.
   */
  protected productsResource = httpResource<PageResponse<Product>>(() => {
    const params: Record<string, string | number> = {
      page: this.page(),
      size: PAGE_SIZE,
      sort: 'name,asc',
    };
    if (this.categoryId() !== null) params['categoryId'] = this.categoryId()!;
    if (this.minPrice() !== null) params['minPrice'] = this.minPrice()!;
    if (this.maxPrice() !== null) params['maxPrice'] = this.maxPrice()!;
    if (this.keyword()) params['keyword'] = this.keyword();

    return {
      url: `${environment.apiUrl}/api/v1/products`,
      params,
    };
  });

  // This endpoint has NO dynamic parameters, so it fetches exactly
  // once, on component creation — httpResource doesn't require a
  // function returning a request object; a function returning a plain
  // URL string works too, for the simple, non-reactive case.

  protected categoriesResource = httpResource<ApiEnvelope<Category[]>>(
    () => `${environment.apiUrl}/api/v1/categories`
  );

  protected totalPages = computed(() => this.productsResource.value()?.totalPages ?? 1);
  protected isLastPage = computed(() => this.productsResource.value()?.last ?? true);
}