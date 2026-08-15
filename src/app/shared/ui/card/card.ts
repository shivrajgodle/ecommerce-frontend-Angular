import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  padded = input(true);
  interactive = input(false); // set true for clickable cards, e.g. product tiles (Phase 3)
}

