import { Component, OnInit } from '@angular/core';
import { SinglePokemonFetch } from '../services/pokemons/fetch.service';
import { Pokemon } from '@utils/pokemon';
import {
  IonContent,
  IonImg,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavParams } from '@ionic/angular';
import { heartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { SupabaseService } from '../services/supabase.service';
import { Favorite } from '../services/pokemons/favorite.service';

@Component({
  selector: 'pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
  imports: [
    IonContent,
    CommonModule,
    IonImg,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
  ],
})
export class PokemonComponent implements OnInit {
  pokemon: Pokemon | null = null;
  found: boolean = true;
  isFavorite: boolean = false;

  constructor(
    private params: NavParams,
    private fetcher: SinglePokemonFetch,
    private readonly supabase: SupabaseService,
    private favoriteController: Favorite
  ) {
    addIcons({ heartOutline });
  }

  async ngOnInit() {
    const pokemonId = parseInt(this.params.get('id') || '0');

    this.fetcher.fetch(pokemonId).subscribe({
      next: async (pokemon: Pokemon) => {
        this.pokemon = pokemon;
        this.supabase
          .isFavoritePokemon(pokemon.id)
          .then((isFavorite: boolean) => {
            this.isFavorite = isFavorite;
          });
      },
      error: () => (this.found = false),
    });
  }

  async favorite() {
    if (!this.pokemon) return;

    const success = await this.favoriteController.call(
      this.pokemon?.id,
      this.isFavorite
    );
    if (success) {
      this.isFavorite = !this.isFavorite;
    }
  }
}
