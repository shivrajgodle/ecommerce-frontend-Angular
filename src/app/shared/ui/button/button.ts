import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './button.scss',
})
export class Button {
  // input() replaces @Input() — the result IS a signal, readable in
  // both the template (variant()) and TypeScript code the same way.
  // No more separate "property vs. how Angular sees it" distinction
  // that decorator-based @Input() had.
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  loading = input(false);

  // output() replaces @Output() + EventEmitter — no more manually
  // `new EventEmitter<void>()`, just declare what you emit.
  clicked = output<void>();

  // computed() re-evaluates ONLY when a signal it reads actually
  // changes — here, whenever variant()/size() change. This is
  // genuinely cheaper than a getter re-running on every change
  // detection pass, because computed() is itself signal-aware: it
  // knows precisely when it's stale, rather than being re-invoked
  // speculatively.
  classes = computed(() => `size-${this.size()} variant-${this.variant()}`);

  handleClick() {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
