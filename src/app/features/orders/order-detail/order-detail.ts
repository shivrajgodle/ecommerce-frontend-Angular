import { Component, ChangeDetectionStrategy, input, computed, effect } from '@angular/core';
import { Spinner } from "../../../shared/ui/spinner/spinner";
import { Card } from "../../../shared/ui/card/card";
import { OrderStatusBadgeComponent } from "../../../shared/ui/order-status-badge/order-status-badge.component";
import { httpResource } from '@angular/common/http';
import { ApiResponse } from '../../../core/models/api-response.model';
import { OrderDetailResponse } from '../../../core/models/order.model';
import { environment } from '../../../../environments/environment.development';
import { CurrencyPipe, DatePipe } from '@angular/common';

const POLL_INTERVAL_MS = 3000;
@Component({
  selector: 'app-order-detail',
  imports: [Spinner, Card, OrderStatusBadgeComponent, CurrencyPipe, DatePipe,],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail {

  id = input.required<string>();

  protected orderResource = httpResource<ApiResponse<OrderDetailResponse>>(
    () => `${environment.apiUrl}/api/v1/orders/${this.id()}`
  );

  protected order = computed(() => this.orderResource.value()?.data);

  constructor() {
    /**
     * ⚠️ .reload() is part of the resource API surface I'm reasonably
     * but not 100% confident is named exactly this in your installed
     * version — check your IDE's autocomplete on orderResource. if it
     * differs, the CONCEPT here (trigger a refetch of the current
     * request) is what matters; the method name is a minor detail to
     * adjust.
     *
     * effect() re-runs whenever a signal it reads changes — here,
     * order(). The FIRST run happens once the initial fetch resolves.
     * If status is PENDING, we schedule a poll 3 seconds out. The
     * onCleanup callback registered via the effect's function
     * parameter runs automatically BEFORE the effect's next
     * invocation (or when the component is destroyed) — meaning the
     * PREVIOUS interval is always cleared before a new one is set,
     * and the interval is guaranteed cleaned up if the user navigates
     * away mid-poll. Once status resolves to CONFIRMED or CANCELLED,
     * this branch simply doesn't schedule anything further — polling
     * naturally stops, no explicit "stop polling" call needed anywhere.
     */
    effect((onCleanup) => {
      const status = this.order()?.status;
      if (status === 'PENDING') {
        const handle = setInterval(() => this.orderResource.reload(), POLL_INTERVAL_MS);
        onCleanup(() => clearInterval(handle));
      }
    });
  }
}
