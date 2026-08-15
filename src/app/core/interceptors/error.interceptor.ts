import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthStore } from '../services/auth-store';
import { TokenService } from '../services/token-service';
import { ToastService } from '../../shared/ui/toast/toast-service';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const tokenService = inject(TokenService);
  const toast = inject(ToastService);
  const router = inject(Router);

  const isAuthRequest = req.url.includes('/api/v1/auth/');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 on anything OTHER than the auth endpoints themselves —
      // attempt exactly ONE refresh-and-retry. If the refresh call
      // ITSELF fails (caught by the inner catchError), we do NOT
      // attempt another refresh — we log out and redirect. This is
      // what prevents an infinite retry loop.
      if (error.status === 401 && !isAuthRequest) {
        return from(authStore.refreshAccessToken()).pipe(
          switchMap(() => {
            const newToken = tokenService.getAccessToken();
            const retried = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
            return next(retried);
          }),
          catchError((refreshError) => {
            authStore.logout();
            router.navigate(['/login']);
            toast.error('Your session expired — please sign in again.');
            return throwError(() => refreshError);
          })
        );
      }

      // Everything else — pulls the backend's ApiResponse.message
      // straight through (the SAME envelope every service in this
      // whole project returns, from Identity Service's Phase C File 4
      // onward) so the toast shows the actual backend error, not a
      // generic frontend guess.
      const message = error.error?.message ?? 'Something went wrong. Please try again.';
      if (error.status === 403) {
        toast.error("You don't have permission to do that.");
      } else if (error.status === 503) {
        toast.error('A service is temporarily unavailable — please try again shortly.');
      } else if (error.status !== 401) {
        toast.error(message);
      }
      return throwError(() => error);
    })
  );
};