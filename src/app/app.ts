import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from "./shared/ui/toast/toast.component";
import { CartStore } from './core/services/cart.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  // Injected but deliberately UNUSED beyond this line — the point is
  // purely to force CartStore's constructor (and its effect()) to run
  // at app bootstrap, not to call anything on it here. This pattern —
  // "inject a singleton service at the root just to kick off its
  // startup side effects" — is a genuinely common, if slightly
  // unusual-looking, Angular idiom worth recognizing.
  private cartStore = inject(CartStore);
}
