import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonCard } from '@utils/pokemon';
import {
  IonIcon,
  IonImg,
  IonButton,
  IonNavLink,
} from '@ionic/angular/standalone';
import { heartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FavoriteEventData } from '@customTypes/pokemon';
import { RouterModule } from '@angular/router';
import { PokemonComponent } from '../pokemon/pokemon.component';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [IonIcon, IonImg, IonButton, RouterModule, IonNavLink],
})
export class CardComponent {
  @Input() pokemon!: PokemonCard;
  @Input() isFavorite!: boolean;

  pokemonComponent = PokemonComponent;

  @Output() favoriteEvent: EventEmitter<FavoriteEventData> = new EventEmitter();

  constructor() {
    addIcons({ heartOutline });
  }

  favorite() {
    this.favoriteEvent.emit({
      pokemonId: this.pokemon.id,
      wasFavorite: this.isFavorite,
    });
  }
}
