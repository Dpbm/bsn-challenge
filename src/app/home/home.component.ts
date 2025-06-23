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
  private currentOffset: number = 0;
  pokemons: PokemonCard[] = [];
  favorites: Set<PokemonId> = new Set();
  isLogged: boolean = !!this.supabase.session;

  selectedPokemon: PokemonId | null = null;

  loginComponent = LoginComponent;
  userComponent = UserComponent;

  constructor(
    private fetcher: MultiplePokemonFetch,
    private favoriteCallback: Favorite,
    private readonly supabase: SupabaseService
  ) {}

  private getPokemons() {
    this.fetcher.fetch(this.currentOffset).subscribe({
      next: (pokemons: PokemonCard[]) => {
        this.pokemons = [...this.pokemons, ...pokemons];
        this.currentOffset += pokemons.length;
      },
    });
  }

  private async getFavorites() {
    const data = await this.supabase.getFavoritePokemons(this.currentOffset);
    this.favorites = new Set(data);
  }

  private async getData() {
    this.getFavorites().then(() => {
      this.getPokemons();
    });
  }

  async ngOnInit() {
    this.isLogged = await this.supabase.isLogged();
    await this.getData();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 500); // debounce
  }

  async favoriteHandler(event: FavoriteEventData) {
    const success = await this.favoriteCallback.call(
      event.pokemonId,
      event.wasFavorite
    );

    if (!success) return;

    if (event.wasFavorite) {
      this.favorites.delete(event.pokemonId);
      return;
    }

    this.favorites.add(event.pokemonId);
  }

  isFavorite(id: PokemonId): boolean {
    return this.favorites.has(id);
  }

  navigationHandler(event: CardNavigationEvent) {
    this.selectedPokemon = event.pokemonId;
  }

  ionViewDidEnter() {
    if (!this.selectedPokemon) return;

    this.supabase.isFavoritePokemon(this.selectedPokemon).then((favorite) => {
      if (favorite && !this.favorites.has(this.selectedPokemon!)) {
        this.favorites.add(this.selectedPokemon!);
      } else if (!favorite && this.favorites.has(this.selectedPokemon!)) {
        this.favorites.delete(this.selectedPokemon!);
      }
    });
  }
}
