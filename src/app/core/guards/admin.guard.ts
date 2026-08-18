import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../services/auth-store';

/**
 * Distinct from authGuard (Phase 2) — that one asks "are you logged
 * in at all?"; this one asks the NEXT question, "given you're logged
 * in, do you have the right role?" When BOTH guard functions are
 * listed on a route's canActivate array, Angular runs them in ORDER
 * and short-circuits on the first false — an unauthenticated user
 * never even reaches this role check; authGuard already redirected
 * them to /login. This mirrors the exact layering the BACKEND uses
 * (authentication, then authorization, as two separate concerns) —
 * the frontend's route guards are just the UI-convenience version of
 * the same two-step check.
 */
export const adminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAdmin()) {
    return true;
  }
  router.navigate(['/products']);
  return false;
};