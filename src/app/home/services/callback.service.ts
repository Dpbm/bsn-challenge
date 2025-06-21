import { Injectable } from '@angular/core';
import { PokemonId } from '@customTypes/pokemon';
import { SupabaseService } from 'src/app/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class FavoriteCallback {
  constructor(private readonly supabase: SupabaseService) {}

  async call(id: PokemonId, wasFavorite: boolean): Promise<boolean> {
    /**
     * @param {pokemonId} id - the pokemon to favorite
     * @returns {boolean} - the returning status
     */

    let error = null;
    if (wasFavorite) {
      error = await this.supabase.removeFavoritePokemon(id);
    } else {
      error = await this.supabase.addFavoritePokemon(id);
    }

    return !error;
  }
}
