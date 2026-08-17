import { Component, computed, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="stars" [class.interactive]="!readonly()" (mouseleave)="hoverValue.set(0)">
      @for (star of starIndices(); track star) {
        <span
          class="star"
          [class.filled]="star <= displayValue()"
          (mouseenter)="onHover(star)"
          (click)="onSelect(star)"
          >★</span
        >
      }
    </div>
  `,
  styles: `
    .stars {
      display: inline-flex;
      gap: 2px;
    }
    .star {
      font-size: 1.125rem;
      color: var(--color-border);
      line-height: 1;
    }
    .star.filled {
      color: #d4a017;
    }
    .interactive .star {
      cursor: pointer;
      transition: transform 0.1s ease;
    }
    .interactive .star:hover {
      transform: scale(1.15);
    }
  `,
})
export class StarRatingComponent {
  max = input(5);
  readonly = input(true);

  // model() again — the interactive review form (Step 4) binds
  // [(value)]="formRating" directly onto this exact same component
  // that also renders READ-ONLY average ratings elsewhere on this
  // page, just with readonly() left at its default true. One
  // component, two roles, driven entirely by that one input.
  value = model(0);

  protected hoverValue = signal(0);
  protected starIndices = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));
  protected displayValue = computed(() => this.hoverValue() || this.value());

  onHover(star: number) {
    if (!this.readonly()) this.hoverValue.set(star);
  }

  onSelect(star: number) {
    if (!this.readonly()) this.value.set(star);
  }
}
