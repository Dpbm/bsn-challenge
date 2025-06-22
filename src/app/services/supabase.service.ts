import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthError,
  AuthSession,
  createClient,
  PostgrestError,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '@env/environment';
import { FavoriteData, PokemonId } from '@customTypes/pokemon';

const noUserError = () =>
  new PostgrestError({ message: 'No User!', code: '', details: '', hint: '' });

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  async userId(): Promise<string | null> {
    return this.supabase.auth
      .getSession()
      .then(({ data }) => data.session?.user.id || null);
  }

  async isLogged(): Promise<boolean> {
    return this.supabase.auth.getSession().then(({ data }) => !!data.session);
  }

  async login(email: string): Promise<AuthError | null> {
    const { error } = await this.supabase.auth.signInWithOtp({ email });
    return error;
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  async signOut(): Promise<AuthError | null> {
    const { error } = await this.supabase.auth.signOut();
    return error;
  }

  async addFavoritePokemon(
    pokemon_id: PokemonId
  ): Promise<PostgrestError | null> {
    return this.userId().then(async (userId: string | null) => {
      if (!userId) return noUserError();

      const { error } = await this.supabase
        .from('favorites')
        .insert({ user_id: userId, pokemon_id });

      return error;
    });
  }

  async removeFavoritePokemon(
    pokemon_id: PokemonId
  ): Promise<PostgrestError | null> {
    return this.userId().then(async (userId: string | null) => {
      if (!userId) return noUserError();

      const { error } = await this.supabase
        .from('favorites')
        .delete()
        .match({ user_id: userId, pokemon_id });

      return error;
    });
  }

  async getFavoritePokemons(): Promise<FavoriteData[]> {
    return this.userId().then(async (userId: string | null) => {
      if (!userId) return [];

      const { data } = await this.supabase
        .from('favorites')
        .select('pokemon_id')
        .match({ user_id: userId });

      return data || [];
    });
  }
}
