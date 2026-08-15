import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * Every route below is EMPTY for now — a placeholder object with just
 * a path and title. We fill each one in with a real loadComponent()
 * as its owning feature gets built, phase by phase. Declaring the
 * full route SHAPE now, even before the components exist, gives us a
 * stable map of the whole app's navigation from day one.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'login', title: 'Sign in', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'register', title: 'Create account', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
  { path: 'products', title: 'Shop', loadComponent: () => import('./features/catalog/product-list/product-list').then(m => m.ProductList) },
  { path: 'products/:id', title: 'Product', loadComponent: () => import('./features/catalog/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'cart', title: 'Cart', canActivate:[authGuard], loadComponent: () => import('./features/cart/cart-page/cart-page').then(m => m.CartPage) },
  { path: 'checkout', title: 'Checkout', canActivate:[authGuard], loadComponent: () => import('./features/checkout/checkout-page/checkout-page').then(m => m.CheckoutPage) },
  { path: 'orders', title: 'Your orders', canActivate:[authGuard], loadComponent: () => import('./features/orders/order-list/order-list').then(m => m.OrderList) },
  { path: 'orders/:id', title: 'Order details',canActivate:[authGuard], loadComponent: () => import('./features/orders/order-detail/order-detail').then(m => m.OrderDetail) },
  { path: '**', redirectTo: 'products' },
];



