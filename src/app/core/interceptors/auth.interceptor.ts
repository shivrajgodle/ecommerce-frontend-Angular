import { HttpInterceptorFn } from "@angular/common/http";
import { TokenService } from "../services/token-service";
import { inject } from "@angular/core";

export const authInterceptors: HttpInterceptorFn = (req,next) => {

    const tokenService = inject(TokenService);
    const token = tokenService.getAccessToken();

    // Never attach a token to the auth endpoints themselves — logging in
    // obviously can't require already being logged in.
    if(token && !req.url.includes('/api/v1/auth/')) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    return next(req);
};