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
  InfiniteScrollCustomEvent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
})
export class UserComponent implements OnInit {
  private currentOffset: number = 0;
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
    await this.getPokemons();
  }

  async getPokemons() {
    this.supabase
      .getFavoritePokemons(this.currentOffset)
      .then((ids: PokemonId[]) => {
        this.fetcher.fetch(ids).subscribe({
          next: (pokemons: PokemonCard[]) =>
            (this.pokemons = [...this.pokemons, ...pokemons]),
        });

        this.currentOffset += ids.length;
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

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.getPokemons();
    setTimeout(() => {
      event.target.complete();
    }, 500); // debounce
  }
}
