import { Component, Input } from '@angular/core';
import { PokemonCard } from '@utils/pokemon';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() pokemon!: PokemonCard;
}
