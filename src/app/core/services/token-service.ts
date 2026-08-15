import { Service, signal } from '@angular/core';
import { AuthResponse, JwtClaims } from '../models/auth.model';

const ACCESS_TOKEN_KEY = 'ecommerce_access_token';
const REFRESH_TOKEN_KEY = 'ecommerce_refresh_token';

@Service()
export class TokenService {

    // Seeded from whatever's ALREADY in localStorage on construction —
    // this is what makes a page refresh NOT log the user out. The
    // signal's initial value is read from persisted storage once, here.
    private readonly _accessToken = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
    readonly accessToken = this._accessToken.asReadonly();

    setTokens(auth:AuthResponse){
        localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
        this._accessToken.set(auth.accessToken);
    }

    getAccessToken(): string | null {
        return this._accessToken();
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    clear(){
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        this._accessToken.set(null);
    }

    /**
   * Decodes the JWT's PAYLOAD segment only — NO signature verification
   * happens here, and none should. This exists purely so the frontend
   * can read claims for UI purposes (show the user's name, hide
   * admin-only buttons, check client-side expiry to skip an
   * unnecessary API call). The actual cryptographic trust boundary —
   * verifying the signature — already lives on the backend
   * (Identity Service's JwtService, the Gateway's JwtValidationFilter,
   * both from Phase C/D) and stays there. A frontend "decoding" a
   * token is a UI convenience; it is never, itself, a security check.
   */
    decodeClaims(token: string): JwtClaims | null {
      try{
        const payload = token.split('.')[1];
        // JWTs use base64URL (- and _ instead of + and /) — atob()
        // expects standard base64, so we convert first.
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c)=> '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );
        return JSON.parse(json) as JwtClaims;
      } catch {
        return null;
      }
    }

    isExpired(claims: JwtClaims): boolean {
        return claims.exp * 1000 < Date.now();
    }
}
