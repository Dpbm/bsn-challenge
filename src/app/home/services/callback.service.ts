import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonId } from '@customTypes/pokemon';
import { SupabaseService } from 'src/app/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class FavoriteCallback {
  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  async call(id: PokemonId, wasFavorite: boolean): Promise<boolean> {
    /**
     * @param {PokemonId} id
     * @param {boolean} wasFavorite
     * @returns {boolean} - whether the action succeeded
     */

    return this.supabase.isLogged().then(async (logged: boolean) => {
      if (!logged) {
        this.router.navigate(['/login']);
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
