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
import { CardNavigationEvent, FavoriteEventData } from '@customTypes/pokemon';
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
  @Output() navigateEvent: EventEmitter<CardNavigationEvent> =
    new EventEmitter();

  constructor() {
    addIcons({ heartOutline });
  }

  favorite() {
    /**
     * Emit an event when user clicks on favorite button.
     * This event is meant to be a callback to his parent component. This way
     * We don't need to inject any state provider for each pokemon card.
     */
    this.favoriteEvent.emit({
      pokemonId: this.pokemon.id,
      wasFavorite: this.isFavorite,
    });
  }

  navigate() {
    /**
     * This method, emits an event when user clicks on the pokemon card
     * to navigate to details page. This way, we can track which pokemon the user
     * interacted with, and then updated states as we need.
     */
    this.navigateEvent.emit({
      pokemonId: this.pokemon.id,
    });
  }
}
