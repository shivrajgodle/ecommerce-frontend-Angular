import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../services/auth-store";
import { inject } from "@angular/core";


export const authGuard: CanActivateFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if(authStore.isAuthenticated()) {
        return true;
    }
    router.navigate(['/login']);
    return false;
}