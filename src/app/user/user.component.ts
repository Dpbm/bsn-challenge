import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import {
  IonHeader,
  IonContent,
  IonButton,
  IonToast,
  InfiniteScrollCustomEvent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { PokemonCard } from '@utils/pokemon';
import { MultipleSpecificPokemonFetch } from '../services/pokemons/fetch.service';
import {
  CardNavigationEvent,
  FavoriteEventData,
  PokemonId,
} from '@customTypes/pokemon';
import { CardComponent } from '../cards/card.component';
import { Favorite } from '../services/pokemons/favorite.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonButton,
    IonToast,
    CardComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonTitle,
    IonGrid,
    IonCol,
    IonRow,
  ],
})
export class UserComponent implements OnInit {
  private currentOffset: number = 0; // offset for pagination

  email: string = '';

  pokemons: PokemonCard[] = [];
  selectedPokemon: PokemonId | null = null; // id of the selected pokemon (navigate to details)

  // toast status
  failedLogoutToastIsOpen: boolean = false;

  constructor(
    private readonly supabase: SupabaseService,
    private fetcher: MultipleSpecificPokemonFetch,
    private favoriteCallback: Favorite,
    private navigation: NavigationService
  ) {}

  ngOnInit() {
    // save users email to be shown
    this.supabase
      .email()
      .then((email: string | null) => (this.email = email || ''));
    this.getPokemons();
  }

  getPokemons() {
    /**
     * Fetch a page of favorite pokemons.
     */

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

  logout() {
    /**
     * Try to logout. If an error occurs, a toast is shown, otherwise
     * the user is redirected to login.
     */

    this.supabase.signOut().then(async (error) => {
      if (error) {
        this.failedLogoutToastIsOpen = true;
        return;
      }

      await this.navigation.goToLogin();
    });
  }

  favoriteHandler(event: FavoriteEventData) {
    /**
     * Handle when user clicks on the favorite button.
     */

    this.favoriteCallback
      .call(event.pokemonId, event.wasFavorite)
      .then((success: boolean) => {
        if (!success) return;
        this.clearPokemons(event.pokemonId);
      });
  }

  clearPokemons(pokemonId: PokemonId) {
    /**
     * Removes a pokemon from the current list.
     *
     * @params {PokemonId} pokemonId - the pokemon to be removed
     */

    this.pokemons = this.pokemons.filter(
      (pokemon: PokemonCard) => pokemon.id != pokemonId
    );
  }

  closeToast() {
    /**
     * Helper function in charge to close the toast.
     */
    this.failedLogoutToastIsOpen = false;
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    /**
     * Event for infinite scroll.
     */

    this.getPokemons();
    setTimeout(() => {
      /**
       * Debounce the scroll event.
       */
      event.target.complete();
    }, 500);
  }

  navigationHandler(event: CardNavigationEvent) {
    /**
     * Helper function to handle the navigation event.
     */
    this.selectedPokemon = event.pokemonId;
  }

  ionViewDidEnter() {
    /**
     * Event in charge to update the pokemon user has navigated to.
     * In this meantime, the user could have updated the favorite status, so we
     * need to handle that here too.
     */

    if (!this.selectedPokemon) return;
    const pokemonId: PokemonId = this.selectedPokemon;

    this.supabase.isFavoritePokemon(pokemonId).then((favorite) => {
      if (favorite) return;

      // if it's not a favorite anymore, we remove it from our local state.
      this.clearPokemons(pokemonId);
    });
  }
}
