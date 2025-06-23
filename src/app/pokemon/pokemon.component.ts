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

  constructor(private params: NavParams, private fetcher: SinglePokemonFetch) {
    addIcons({ heartOutline });
  }

  ngOnInit() {
    const pokemonId = parseInt(this.params.get('id') || '0');
    this.fetcher.fetch(pokemonId).subscribe({
      next: (pokemon: Pokemon) => (this.pokemon = pokemon),
      error: () => (this.found = false),
    });
  }
}
