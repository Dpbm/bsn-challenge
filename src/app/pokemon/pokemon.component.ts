import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SinglePokemonFetch } from '../services/pokemons/fetch.service';
import { Pokemon } from '@utils/pokemon';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
  imports: [IonContent, CommonModule],
})
export class PokemonComponent implements OnInit {
  pokemon: Pokemon | null = null;
  found: boolean = true;

  constructor(private params: NavParams, private fetcher: SinglePokemonFetch) {}

  ngOnInit() {
    const pokemonId = parseInt(this.params.get('id') || '0');
    this.fetcher.fetch(pokemonId).subscribe({
      next: (pokemon: Pokemon) => (this.pokemon = pokemon),
      error: () => (this.found = false),
    });
  }
}
