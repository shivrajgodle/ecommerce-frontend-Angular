import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {
  label = input('');
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  placeholder = input('');
  required = input(false);
  errorMessage = input<string | null>(null);

  /**
   * model() is a TWO-WAY binding signal — the parent can do
   * [(value)]="someSignal" on this component exactly like ngModel used
   * to work, but it's a plain signal underneath, not a directive
   * relying on Zone.js to notice changes. Deliberately NOT using
   * FormsModule/ngModel or implementing ControlValueAccessor here —
   * this component is meant for simple, standalone controlled inputs
   * (a search box, a quantity field) OUTSIDE a full form. For actual
   * FORMS (login, register, checkout — Phase 2 onward), we reach for
   * Angular 22's stable Signal Forms API instead, which has its own
   * [field] directive and a different, more form-aware integration
   * pattern — intentionally not forcing every input through this one
   * generic wrapper.
   */
  value = model('');

  inputId = `input-${Math.random().toString(36).slice(2, 9)}`;
}
