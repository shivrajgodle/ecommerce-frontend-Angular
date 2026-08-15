import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthStore } from '../../../core/services/auth-store';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { Button } from '../../../shared/ui/button/button';
import { Card } from '../../../shared/ui/card/card';

interface RegisterFormModel {
  fullName: string;
  email: string;
  password: string;
}
@Component({
  selector: 'app-register',
  imports: [RouterLink, Button, Card],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './register.scss',
})
export class Register {

  private authStore = inject(AuthStore);
  private router = inject(Router);

  protected submitting = signal(false);

  private model = signal<RegisterFormModel>({ fullName: '', email: '', password: '' });

  protected registerForm = form(this.model, (path) => {
    required(path.fullName, { message: 'Full name is required' });
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' });
    required(path.password, { message: 'Password is required' });
  });

  async handleSubmit(event: Event) {
    event.preventDefault();
    await submit(this.registerForm, async () => {
      this.submitting.set(true);
      try {
        await this.authStore.register(this.model());
        this.router.navigate(['/products']);
      } catch {
        // handled by errorInterceptor
      } finally {
        this.submitting.set(false);
      }
    });
  }
}
