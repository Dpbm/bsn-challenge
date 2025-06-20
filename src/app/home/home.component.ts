import { Component, OnInit } from '@angular/core';
import { MultiplePokemonFetch } from '../services/pokemons/fetch.service';
import { PokemonCard } from '@utils/pokemon';
import { CommonModule } from '@angular/common';
import { CardComponent } from './cards/card.component';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    CardComponent,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonList,
  ],
})
export class HomeComponent implements OnInit {
  private currentOffset: number = 0;
  pokemons: PokemonCard[] = [];

  constructor(private fetcher: MultiplePokemonFetch) {}

  private getPokemons() {
    this.fetcher.fetch(this.currentOffset).subscribe({
      next: (pokemons: PokemonCard[]) => {
        console.log(pokemons);
        this.pokemons = [...this.pokemons, ...pokemons];
        this.currentOffset += pokemons.length;
      },
    });
  }

  ngOnInit() {
    this.getPokemons();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.getPokemons();
    setTimeout(() => {
      event.target.complete();
    }, 500); // debounce
  }
}
