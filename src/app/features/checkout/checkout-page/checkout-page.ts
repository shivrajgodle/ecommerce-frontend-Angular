import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Card } from '../../../shared/ui/card/card';
import { Button } from '../../../shared/ui/button/button';
import { CartStore } from '../../../core/services/cart.store';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../shared/ui/toast/toast-service';
import { Router } from '@angular/router';
import { ShippingAddressRequest } from '../../../core/models/order.model';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout-page',
  imports: [Card, Button, CurrencyPipe, FormField],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
})
export class CheckoutPage {
  protected cartStore = inject(CartStore);
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private router = inject(Router);

  protected placingOrder = signal(false);

  private model = signal<ShippingAddressRequest>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  protected addressForm = form(this.model, (path) => {
    required(path.street, { message: 'Street address is required' });
    required(path.city, { message: 'City is required' });
    required(path.state, { message: 'State is required' });
    required(path.zipCode, { message: 'ZIP code is required' });
    required(path.country, { message: 'Country is required' });
  });

  async handleSubmit(event: Event) {
    event.preventDefault();

    await submit(this.addressForm, async () => {
      this.placingOrder.set(true);
      try {
        /**
         * We deliberately do NOT clear the cart or reset local state
         * here on success — Order Service (Phase H, Step 5 of the
         * backend) already clears the cart SERVER-SIDE as part of
         * checkout. Calling cartStore.loadCart() re-syncs the frontend
         * with that authoritative server state, rather than the
         * frontend independently guessing/replicating what the
         * backend already did. This is the same "don't duplicate the
         * source of truth" instinct that kept CartItem's productName
         * OUT of denormalization back on the backend, just applied at
         * the frontend/backend boundary this time.
         */
        const order = await this.orderService.checkout({ shippingAddress: this.model() });
        await this.cartStore.loadCart();
        this.toast.success('Order placed! Awaiting payment confirmation.');
        this.router.navigate(['/orders', order.id]);
      } catch {
        // errorInterceptor already surfaced the specific failure —
        // insufficient stock, a downstream service unavailable
        // (Phase H's CartServiceUnavailableException/
        // CatalogServiceUnavailableException surface here as real,
        // specific 503 toasts), etc. Nothing extra needed.
      } finally {
        this.placingOrder.set(false);
      }
    });
  }

}
