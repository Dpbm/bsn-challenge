import { Component, OnInit } from '@angular/core';
import { MultiplePokemonFetch } from '../services/pokemons/fetch.service';
import { PokemonCard } from '@utils/pokemon';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../cards/card.component';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonButton,
  IonHeader,
  IonAvatar,
  IonNavLink,
  IonToolbar,
  IonButtons,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import {
  CardNavigationEvent,
  FavoriteEventData,
  PokemonId,
} from '@customTypes/pokemon';
import { Favorite } from '../services/pokemons/favorite.service';
import { LoginComponent } from '../login/login.component';
import { UserComponent } from '../user/user.component';
import { from } from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonList,
    IonButton,
    IonHeader,
    IonAvatar,
    IonNavLink,
    IonToolbar,
    IonButtons,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class HomeComponent implements OnInit {
  private currentOffset: number = 0; // offset for pagination

  pokemons: PokemonCard[] = [];
  favorites: Set<PokemonId> = new Set();

  isLogged: boolean = false;

  /* used for handling the navigation to pokemon details page
  using that, after returning to home, we can check the data  
  about this specific pokemon. */
  selectedPokemon: PokemonId | null = null;

  // Components for routing
  loginComponent = LoginComponent;
  userComponent = UserComponent;

  constructor(
    private fetcher: MultiplePokemonFetch,
    private favoriteCallback: Favorite,
    private readonly supabase: SupabaseService
  ) {}

  private getPokemons() {
    /**
     * Get pokemons data from PokeAPI.
     * Once it uses the http client from angular, it returns an observable that
     * must be subscribed.
     */
    this.fetcher.fetch(this.currentOffset).subscribe({
      next: (pokemons: PokemonCard[]) => {
        this.pokemons = [...this.pokemons, ...pokemons];
        this.currentOffset += pokemons.length;
      },
    });
  }

  private getFavorites() {
    /**
     * We use the supabase client to fetch the favorites from our postgres database.
     * It returns a promise with the pokemons IDs.
     */

    this.supabase
      .getFavoritePokemons(this.currentOffset)
      .then(
        (pokemons: PokemonId[]) =>
          (this.favorites = new Set([
            ...Array.from(this.favorites),
            ...pokemons,
          ]))
      );
  }

  private getData() {
    /**
     * Fetch all pokemons related data at once.
     */
    this.getFavorites();
    this.getPokemons();
  }

  ngOnInit() {
    this.supabase
      .isLogged()
      .then((isLogged: boolean) => (this.isLogged = isLogged));
    this.getData();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    /**
     * Used for infinite scroll component.
     */

    this.getData();

    setTimeout(() => {
      /**
       * Ensures that the scroll event is
       * hit only once after so time.
       * It help us to avoid duplicated requests.
       */

      event.target.complete();
    }, 500); // debounce
  }

  favoriteHandler(event: FavoriteEventData) {
    /**
     * The handler for favorite calls.
     * It's a callback for clicking on favorite button.
     *
     * Using this one, we can track which cards were saved as favorite
     * by the user.
     */

    this.favoriteCallback
      .call(event.pokemonId, event.wasFavorite)
      .then((success: boolean) => {
        if (!success) return;

        if (event.wasFavorite) {
          this.favorites.delete(event.pokemonId);
          return;
        }

        this.favorites.add(event.pokemonId);
      });
  }

  isFavorite(id: PokemonId): boolean {
    /**
     * Helper function that cards use to
     * know which pokemon is on favorites list.
     */
    return this.favorites.has(id);
  }

  navigationHandler(event: CardNavigationEvent) {
    /**
     * Handler to check which pokemon the user
     * has click to see details.
     */

    this.selectedPokemon = event.pokemonId;
  }

  ionViewDidEnter() {
    /**
     * The event raised after coming back from some page.
     * If the selected pokemon is not null, we check if his favorite status
     * has changed.
     */
    if (!this.selectedPokemon) return;

    const pokemonId: PokemonId = this.selectedPokemon;

    this.supabase.isFavoritePokemon(this.selectedPokemon).then((favorite) => {
      if (favorite && !this.favorites.has(pokemonId)) {
        /**
         * Since we know that this pokemon wasn't in favorites list
         * and now its status says that his a favorite, we need to add it to our
         * local list.
         */
        this.favorites.add(pokemonId);
      } else if (!favorite && this.favorites.has(pokemonId)) {
        /**
         * Now, once it not a favorite pokemon and it's in the list, we need
         * to remove it from there.
         */
        this.favorites.delete(pokemonId);
      }
    });
  }
}
