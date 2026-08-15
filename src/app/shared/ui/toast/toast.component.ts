import { Component, inject } from '@angular/core';
import { ToastService } from './toast-service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-stack">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type" (click)="toastService.dismiss(toast.id)">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: `
    .toast-stack {
      position: fixed;
      bottom: var(--space-6);
      right: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      z-index: 1000;
    }
    .toast {
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      max-width: 320px;
      color: white;
      animation: slide-in 0.2s ease;

      &.success {
        background: var(--color-success);
      }
      &.error {
        background: var(--color-danger);
      }
      &.info {
        background: var(--color-ink);
      }
    }
    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateX(16px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
})
export class ToastComponent {
  // inject() is the FUNCTIONAL alternative to constructor injection —
  // works identically, but reads more naturally as a field
  // declaration and, importantly, works in places a constructor can't
  // reach (like inside a functional interceptor, which we'll write in
  // Phase 2 — no class, no constructor, just inject() called directly
  // inside the function body).
  protected toastService = inject(ToastService);
}
