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
  IonButton,
  IonHeader,
  IonAvatar,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

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
    IonButton,
    IonHeader,
    IonAvatar,
    RouterModule,
  ],
})
export class HomeComponent implements OnInit {
  private currentOffset: number = 0;
  pokemons: PokemonCard[] = [];
  isLogged: boolean = !!this.supabase.session;

  constructor(
    private fetcher: MultiplePokemonFetch,
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

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.isLogged = !!session));
    this.getPokemons();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.getPokemons();
    setTimeout(() => {
      event.target.complete();
    }, 500); // debounce
  }
}
