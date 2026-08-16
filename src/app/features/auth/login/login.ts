import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { AuthStore } from '../../../core/services/auth-store';
import { Router, RouterLink } from '@angular/router';
import { Card } from "../../../shared/ui/card/card";
import { Button } from '../../../shared/ui/button/button';
import { Input } from "../../../shared/ui/input/input";

interface LoginFormModel {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  imports: [RouterLink, Button, Card, Input],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.scss',
})
export class Login {

  private authStore = inject(AuthStore);
  private router = inject(Router);

  protected email = signal('');
  protected password = signal('');
  protected submitting = signal(false);

  // Gates error visibility until the first submit attempt — the same
  // "don't yell at the user before they've tried" UX Signal Forms'
  // touched() state was giving us, just expressed with a plain signal.
  private submitted = signal(false);

  protected emailError = computed(() => {
    if (!this.submitted()) return null;
    if (!this.email().trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email())) return 'Enter a valid email address';
    return null;
  });

  protected passwordError = computed(() => {
    if (!this.submitted()) return null;
    if (!this.password().trim()) return 'Password is required';
    return null;
  });

  async handleSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);

    if (this.emailError() || this.passwordError()) return;

    this.submitting.set(true);
    try {
      await this.authStore.login({ email: this.email(), password: this.password() });
      this.router.navigate(['/products']);
    } catch {
      // errorInterceptor already surfaces a toast on failure
    } finally {
      this.submitting.set(false);
    }
  }

}
