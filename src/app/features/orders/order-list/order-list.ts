import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { Spinner } from "../../../shared/ui/spinner/spinner";
import { Card } from "../../../shared/ui/card/card";
import { OrderStatusBadgeComponent } from "../../../shared/ui/order-status-badge/order-status-badge.component";
import { httpResource } from '@angular/common/http';
import { PageResponse } from '../../../core/models/page.model';
import { OrderResponse } from '../../../core/models/order.model';
import { environment } from '../../../../environments/environment.development';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports: [Spinner, Card, OrderStatusBadgeComponent, RouterLink, CurrencyPipe, DatePipe,],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList {
   protected page = signal(0);

  protected ordersResource = httpResource<PageResponse<OrderResponse>>(() => ({
    url: `${environment.apiUrl}/api/v1/orders`,
    params: { page: this.page(), size: 10 },
  }));

  protected totalPages = computed(() => this.ordersResource.value()?.totalPages ?? 1);
}
