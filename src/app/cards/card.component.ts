import { Component, Input } from '@angular/core';
import { PokemonCard } from '@utils/pokemon';
import { IonIcon, IonImg } from '@ionic/angular/standalone';
import { heartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PokemonId } from '@customTypes/pokemon';
import { FavoriteCallback } from '../home/services/callback.service';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [IonIcon, IonImg],
})
export class CardComponent {
  @Input() pokemon!: PokemonCard;
  @Input() isFavorite!: boolean;

  constructor(private callback: FavoriteCallback) {
    addIcons({ heartOutline });

    this.callback = callback;
  }

  async favorite(id: PokemonId) {
    const success = await this.callback.call(id, this.isFavorite);
    if (success) {
      this.isFavorite = !this.isFavorite;
    }
  }
}
