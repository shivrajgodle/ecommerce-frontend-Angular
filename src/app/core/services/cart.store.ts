import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { AuthStore } from "./auth-store";
import { ToastService } from "../../shared/ui/toast/toast-service";
import { CartResponse } from "../models/cart.model";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { environment } from "../../../environments/environment.development";

@Injectable({providedIn: 'root'})
export class CartStore {

    private http = inject(HttpClient);
    private authStore = inject(AuthStore);
    private toast = inject(ToastService);

    private readonly _cart = signal<CartResponse | null>(null);
    readonly cart = this._cart.asReadonly();

    readonly itemCount = computed(() => this._cart()?.items.reduce((sum,item) => sum + item.quantity, 0) ?? 0);
    readonly isEmpty = computed(() => this.itemCount() === 0);

    constructor(){
        /**
         * effect() runs a side-effecting callback whenever a signal it
         * reads changes — the same dependency-tracking mechanism as
         * computed(), but for actions rather than derived values. Reading
         * authStore.isAuthenticated() here means this fires exactly once
         * on construction (with whatever the current auth state is —
         * important, since a page refresh restores auth state from
         * localStorage BEFORE this runs, so a returning logged-in user's
         * cart loads immediately) and again every time login/logout flips
         * that signal afterward.
         *
         * This is what keeps CartStore correctly in sync with AuthStore
         * without CartStore and AuthStore needing to know much about each
         * other beyond this one signal — CartStore REACTS to auth state,
         * it doesn't call into AuthStore's login/logout flow directly.
         */
        effect(() => {
            if(this.authStore.isAuthenticated()){
                this.loadCart();
            } else {
                this._cart.set(null); // logged out — clear any previous user's cart from memory
            }
        });
    }


    async loadCart(): Promise<void> {
        try{
            const response = await firstValueFrom(
                this.http.get<ApiResponse<CartResponse>>(`${environment.apiUrl}/api/v1/cart`)
            );
            this._cart.set(response.data);
        }catch{
            // errorInterceptor (Phase 2) already surfaces a toast on failure
        }
    }

    async addItem(productId:number, quantity:number):Promise<void>{
        const response = await firstValueFrom(
                this.http.post<ApiResponse<CartResponse>>(`${environment.apiUrl}/api/v1/cart/items`,{
                    productId,
                    quantity
                }));
        this._cart.set(response.data);
        this.toast.success('Added to cart');
    }

    async updateQuantity(itemId:number, quantity:number):Promise<void> {
        const response = await firstValueFrom(
            this.http.put<ApiResponse<CartResponse>>(`${environment.apiUrl}/api/v1/cart/items/${itemId}`,
            {quantity})
        );

        this._cart.set(response.data); 
    }

    async removeItem(itemId:number): Promise<void>{
        const response = await firstValueFrom(
            this.http.delete<ApiResponse<CartResponse>>(`${environment.apiUrl}/api/v1/cart/items/${itemId}`)
        );
        this._cart.set(response.data);
    }

}