import { Injectable } from '@angular/core';
import { PokemonId } from '@customTypes/pokemon';
import { SupabaseService } from 'src/app/services/supabase.service';
import { NavigationService } from '../navigation.service';

@Injectable({ providedIn: 'root' })
export class Favorite {
  constructor(
    private readonly supabase: SupabaseService,
    private navigation: NavigationService
  ) {}

  call(id: PokemonId, wasFavorite: boolean): Promise<boolean> {
    /**
     * A helper service to handle favorites
     *
     * @param {PokemonId} id
     * @param {boolean} wasFavorite
     * @returns {boolean} - whether the action succeeded
     */

    return this.supabase.isLogged().then(async (logged: boolean) => {
      if (!logged) {
        await this.navigation.goToLogin();
        return false;
      }

      let error = null;
      if (wasFavorite) {
        error = await this.supabase.removeFavoritePokemon(id);
      } else {
        error = await this.supabase.addFavoritePokemon(id);
      }
      return !error;
    });
  }
}
