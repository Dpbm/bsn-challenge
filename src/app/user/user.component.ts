import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import {
  IonHeader,
  IonContent,
  IonText,
  IonButton,
  IonToast,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Pokemon } from '@utils/pokemon';
import { MultipleSpecificPokemonFetch } from '../services/pokemons/fetch.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [IonHeader, IonContent, IonButton, IonText, IonToast],
})
export class UserComponent implements OnInit {
  email: string = '';
  failedLogoutToastIsOpen: boolean = false;
  pokemons: Pokemon[] = [];

  constructor(
    private readonly supabase: SupabaseService,
    private fetcher: MultipleSpecificPokemonFetch,
    private router: Router
  ) {}

  async ngOnInit() {
    this.email = (await this.supabase.email()) || '';

    this.supabase.getFavoritePokemons().then(() => {});
  }

  async logout() {
    const error = await this.supabase.signOut();

    if (error) {
      this.failedLogoutToastIsOpen = true;
      return;
    }

    this.router.navigate(['/login']);
  }

  closeToast() {
    this.failedLogoutToastIsOpen = false;
  }
}
