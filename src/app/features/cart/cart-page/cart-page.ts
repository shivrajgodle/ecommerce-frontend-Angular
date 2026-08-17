import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Card } from "../../../shared/ui/card/card";
import { Button } from "../../../shared/ui/button/button";
import { CartStore } from '../../../core/services/cart.store';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-page',
  imports: [Card, Button, RouterLink, CurrencyPipe],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  protected cartStore = inject(CartStore);

  async updateQty(itemId: number, newQuantity: number) {
    if (newQuantity < 1) return;
    await this.cartStore.updateQuantity(itemId, newQuantity);
  }

  async remove(itemId: number) {
    await this.cartStore.removeItem(itemId);
  }
}
