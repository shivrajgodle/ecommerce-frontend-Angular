import { Injectable, Service, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    // PRIVATE writable signal — only THIS service can mutate the list.
    private readonly _toasts = signal<Toast[]>([]);

    // PUBLIC read-only view. .asReadonly() returns a signal that can be
    // READ but never .set()/.update() from outside — the exact same
    // encapsulation principle as a private field + public getter in
    // plain OOP, just expressed through signals. ToastComponent (below)
    // can react to this signal changing; it can never accidentally push
    // a toast directly into the array itself.
    readonly toasts = this._toasts.asReadonly();

    private nextId = 0;

    show(message: string, type: ToastType = 'info', durationMs = 4000) {
        const id = this.nextId++;
        this._toasts.update((list) => [...list,{id, message, type}]);
        setTimeout(() => this.dismiss(id), durationMs);
    }

    success(message:string){
        this.show(message, 'success');
    }

    error(message:string){
        this.show(message, 'error');
    }

    dismiss(id: number) {
        this._toasts.update((list)=> list.filter((t)=> t.id !== id));
    }

}
