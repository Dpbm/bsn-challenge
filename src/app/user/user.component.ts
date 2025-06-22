import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import {
  IonHeader,
  IonContent,
  IonText,
  IonButton,
  IonToast,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { PokemonCard } from '@utils/pokemon';
import { MultipleSpecificPokemonFetch } from '../services/pokemons/fetch.service';
import { FavoriteEventData, PokemonId } from '@customTypes/pokemon';
import { CardComponent } from '../cards/card.component';
import { Favorite } from '../services/pokemons/favorite.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonButton,
    IonText,
    IonToast,
    IonList,
    IonItem,
    CardComponent,
  ],
})
export class UserComponent implements OnInit {
  email: string = '';
  failedLogoutToastIsOpen: boolean = false;
  pokemons: PokemonCard[] = [];

  constructor(
    private readonly supabase: SupabaseService,
    private fetcher: MultipleSpecificPokemonFetch,
    private router: Router,
    private favoriteCallback: Favorite
  ) {}

  async ngOnInit() {
    this.email = (await this.supabase.email()) || '';

    this.supabase.getFavoritePokemons().then((ids: PokemonId[]) => {
      this.fetcher.fetch(ids).subscribe({
        next: (pokemons: PokemonCard[]) => (this.pokemons = pokemons),
      });
    });
  }

  async logout() {
    const error = await this.supabase.signOut();

    if (error) {
      this.failedLogoutToastIsOpen = true;
      return;
    }

    this.router.navigate(['/login']);
  }

  async favoriteHandler(event: FavoriteEventData) {
    const success = await this.favoriteCallback.call(
      event.pokemonId,
      event.wasFavorite
    );
    if (success) {
      this.pokemons = this.pokemons.filter(
        (pokemon: PokemonCard) => pokemon.id != event.pokemonId
      );
    }
  }

  closeToast() {
    this.failedLogoutToastIsOpen = false;
  }
}
