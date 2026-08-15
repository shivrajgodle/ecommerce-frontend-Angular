import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthStore } from '../../../core/services/auth-store';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { Card } from "../../../shared/ui/card/card";
import { Button } from '../../../shared/ui/button/button';
import { Input } from "../../../shared/ui/input/input";

interface LoginFormModel {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  imports: [RouterLink, Button, Card],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.scss',
})
export class Login {

  private authStore = inject(AuthStore);
  private router = inject(Router);

  protected submitting = signal(false);

  // The MODEL — a plain signal holding the raw form data. form()
  // derives the entire field tree's SHAPE directly from this model's
  // TYPE, which is why LoginFormModel exists as an explicit interface.
  private model = signal<LoginFormModel>({
    email: '',
    password: '',
  });


  // The FORM — form(model, schemaFn) returns a FieldTree. The second
  // argument is where validation rules live, declared per-field via
  // 'path' — path.email, path.password — rather than string-based
  // field names, so a typo like path.emial would be a TypeScript
  // compile error, not a silently-ignored runtime validator.
  protected loginForm = form(this.model,(path) => {
    required(path.email,{message: 'Email is required'});
    email(path.email,{message: 'Enter a valid email address'});
    required(path.password,{message: 'Password is required'});
  });

  async handleSubmit(event: Event) {
    event.preventDefault();
    
    // submit() marks every field TOUCHED first (so validation errors
    // become visible even if the user never focused/blurred a field
    // before hitting Submit), THEN runs the callback ONLY if the form
    // is valid. The callback itself must be async and return a
    // Promise — exactly why AuthStore.login() was designed to return
    // one directly, rather than an Observable requiring a manual
    // .toPromise()-equivalent conversion right here.

    await submit(this.loginForm, async() => {
      this.submitting.set(true);
      try{
        await this.authStore.login(this.model());
        this.router.navigate(['/products']);
      }catch {
        // Failure toast already shown by errorInterceptor — nothing
        // extra to do here except stop the loading spinner.
      } finally {
        this.submitting.set(false);
      }
    });
  }

}
