import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { TokenService } from './token-service';
import { AuthResponse, JwtClaims, LoginRequest, RegisterRequest } from '../models/auth.model';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment.development';

@Service()
export class AuthStore {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private readonly _currentUser = signal<JwtClaims | null>(this.restoreFormStorage());
  readonly currentUser = this._currentUser.asReadonly();

  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly roles = computed(() => this._currentUser()?.roles ?? []);
  readonly isAdmin = computed(() => this.roles().includes('ROLE_ADMIN'));

  private restoreFormStorage(): JwtClaims | null {
    const token = this.tokenService.getAccessToken();
    if (!token) return null;
    const claims = this.tokenService.decodeClaims(token);
    if (!claims || this.tokenService.isExpired(claims)) return null;
    return claims;
  }

  /**
   * Every public method here returns a PROMISE, not an Observable —
   * deliberate, and worth noticing why: HttpClient natively returns
   * Observables, but Signal Forms' submit() (used in the login/
   * register components below) requires an async callback returning a
   * Promise. Converting AT THIS BOUNDARY, once, via firstValueFrom(),
   * means every CONSUMER of AuthStore gets a clean async/await API and
   * never has to think about RxJS at all — the same "absorb the
   * awkward interop in one place" instinct as Order Service's
   * consumer-owned DTOs absorbing Catalog Service's response shape.
   */
  async login(request: LoginRequest): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/api/v1/auth/login`, request),
    );
    this.applyAuthResponse(response.data);
  }

  async register(request: RegisterRequest): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<AuthResponse>>(
        `${environment.apiUrl}/api/v1/auth/register`,
        request,
      ),
    );
    this.applyAuthResponse(response.data);
  }

  async refreshAccessToken(): Promise<void> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await firstValueFrom(
      this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/api/v1/auth/refresh`, {
        refreshToken,
      }),
    );
    this.applyAuthResponse(response.data);
  }

  logout() {
    this.tokenService.clear();
    this._currentUser.set(null);
  }

  applyAuthResponse(auth: AuthResponse) {
    this.tokenService.setTokens(auth);
    this._currentUser.set(this.tokenService.decodeClaims(auth.accessToken));
  }
}
