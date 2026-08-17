import { Component, computed, input } from '@angular/core';
import { OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="statusClass()">{{ label() }}</span>`,
  styles: `
    .badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 3px var(--space-3);
      border-radius: 999px;
    }
    .status-pending {
      background: var(--color-accent-soft);
      color: var(--color-accent-hover);
    }
    .status-confirmed {
      background: var(--color-success-soft);
      color: var(--color-success);
    }
    .status-cancelled {
      background: var(--color-danger-soft);
      color: var(--color-danger);
    }
  `,
})
export class OrderStatusBadgeComponent {
  status = input.required<OrderStatus>();

  protected statusClass = computed(() => `status-${this.status().toLowerCase()}`);
  protected label = computed(() => {
    switch (this.status()) {
      case 'PENDING':
        return 'Awaiting payment';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'CANCELLED':
        return 'Cancelled';
    }
  });
}
