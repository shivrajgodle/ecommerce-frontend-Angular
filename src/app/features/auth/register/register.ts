import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { AuthStore } from '../../../core/services/auth-store';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { Button } from '../../../shared/ui/button/button';
import { Card } from '../../../shared/ui/card/card';
import { Input } from '../../../shared/ui/input/input';

interface RegisterFormModel {
  fullName: string;
  email: string;
  password: string;
}
@Component({
  selector: 'app-register',
  imports: [RouterLink, Button, Card, Input],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  protected fullName = signal('');
  protected email = signal('');
  protected password = signal('');
  protected submitting = signal(false);
  private submitted = signal(false);

  protected fullNameError = computed(() =>
    this.submitted() && !this.fullName().trim() ? 'Full name is required' : null,
  );

  protected emailError = computed(() => {
    if (!this.submitted()) return null;
    if (!this.email().trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email())) return 'Enter a valid email address';
    return null;
  });

  protected passwordError = computed(() =>
    this.submitted() && !this.password().trim() ? 'Password is required' : null,
  );

  async handleSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);

    if (this.fullNameError() || this.emailError() || this.passwordError()) return;

    this.submitting.set(true);
    try {
      await this.authStore.register({
        fullName: this.fullName(),
        email: this.email(),
        password: this.password(),
      });
      this.router.navigate(['/products']);
    } catch {
      // errorInterceptor handles the toast — including the backend's
      // real @Size(min=8) password-length error if it's too short,
      // exactly as flagged when this form was first built
    } finally {
      this.submitting.set(false);
    }
  }
}
