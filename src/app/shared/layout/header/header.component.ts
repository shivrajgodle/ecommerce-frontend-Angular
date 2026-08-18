import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore } from '../../../core/services/cart.store';
import { AuthStore } from '../../../core/services/auth-store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="header-inner">
        <a routerLink="/products" class="logo">Ecommerce</a>

        <nav class="main-nav">
          <a routerLink="/products" routerLinkActive="active">Shop</a>
          @if(authStore.isAuthenticated()) {
            <a routerLink="/orders" routerLinkActive="active">Orders</a>
          }
          @if(authStore.isAdmin()) {
            <a routerLink="/admin/reports" routerLinkActive="active">Reports</a>
          }
        </nav>

        <div class="header-actions">
          @if (authStore.isAuthenticated()) {
            <a routerLink="/cart" routerLinkActive="active" class="cart-link">
              Cart
              @if (cartStore.itemCount() > 0) {
                <span class="cart-badge">{{ cartStore.itemCount() }}</span>
              }
            </a>
            <span class="user-name">{{ displayName() }}</span>
            <button class="logout-btn" (click)="logout()">Sign out</button>
          } @else {
            <a routerLink="/login" class="login-link">Sign in</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: `
    .site-header {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-4) var(--space-6);
      display: flex;
      align-items: center;
      gap: var(--space-8);
    }
    .logo {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-ink);
    }
    .main-nav {
      display: flex;
      gap: var(--space-6);
      flex: 1;
    }
    .main-nav a {
      color: var(--color-ink-soft);
      font-size: 0.9375rem;
      font-weight: 500;
      padding-bottom: 2px;
      border-bottom: 2px solid transparent;
      &.active {
        color: var(--color-ink);
        border-bottom-color: var(--color-accent);
      }
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-5);
    }
    .cart-link {
      position: relative;
      color: var(--color-ink);
      font-size: 0.9375rem;
      font-weight: 500;
      margin-right: 20px;
    }
    .cart-badge {
      position: absolute;
      top: -8px;
      right: -18px;
      background: var(--color-accent);
      color: white;
      font-size: 0.6875rem;
      font-weight: 700;
      min-width: 16px;
      height: 16px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }
    .user-name {
      font-size: 0.875rem;
      color: var(--color-ink-soft);
    }
    .logout-btn {
      border: 1px solid var(--color-border);
      background: none;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
      font-size: 0.8125rem;
      cursor: pointer;
      &:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
      }
    }
    .login-link {
      background: var(--color-accent);
      color: white;
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 600;
    }
  `,
})
export class HeaderComponent {
  protected authStore = inject(AuthStore);
  protected cartStore = inject(CartStore);
  private router = inject(Router);

  // The JWT's 'sub' claim is the user's EMAIL (Identity Service's
  // JwtService set it that way, back in Phase C File 3b — subject =
  // principal.getUsername(), and UserPrincipal.getUsername() returns
  // email specifically). We never put full name in the token at all,
  // so the header shows email, not a display name — a real, deliberate
  // constraint flowing directly from a backend decision made many
  // phases ago, not a frontend oversight.
  protected displayName = () => this.authStore.currentUser()?.sub ?? '';

  logout() {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
