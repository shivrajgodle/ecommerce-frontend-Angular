import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CheckoutRequest, OrderResponse } from "../models/order.model";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { environment } from "../../../environments/environment.development";

/**
 * @Injectable, but NOT a signal-based store like AuthStore/CartStore —
 * a deliberate distinction worth naming explicitly. AuthStore and
 * CartStore hold ONGOING state the whole app cares about continuously
 * (am I logged in right now? what's in my cart right now?). Orders
 * are different: checkout is a one-shot action, and order HISTORY
 * (Phase 6) is naturally page-specific, fetched fresh each time
 * someone visits /orders — there's no app-wide "current order" concept
 * worth holding in a shared signal. A plain service with methods
 * returning Promises is the right-sized tool here; reaching for a
 * store would be over-engineering state that doesn't need to persist
 * or be shared beyond wherever it's directly used.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  async checkout(request: CheckoutRequest): Promise<OrderResponse> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<OrderResponse>>(`${environment.apiUrl}/api/v1/orders/checkout`, request)
    );
    return response.data;
  }
}