import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthError,
  AuthSession,
  createClient,
  PostgrestError,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '@env/environment';
import { FavoriteData, PokemonId } from '@customTypes/pokemon';
import { DEFAULT_POKEMONS_PER_PAGE } from '@utils/constants';

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

  private async getUserData(): Promise<User | null> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    return session?.user || null;
  }

  async userId(): Promise<string | null> {
    return this.getUserData().then((user) => user?.id || null);
  }

  async email(): Promise<string | null> {
    return this.getUserData().then((user) => user?.email || null);
  }

  async isLogged(): Promise<boolean> {
    return this.getUserData().then((user) => !!user);
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

  async getFavoritePokemons(offset: number): Promise<PokemonId[]> {
    return this.userId().then(async (userId: string | null) => {
      if (!userId) return [];

      const { data } = await this.supabase
        .from('favorites')
        .select('pokemon_id')
        .order('pokemon_id', { ascending: true })
        .range(offset, offset + DEFAULT_POKEMONS_PER_PAGE)
        .match({ user_id: userId });

      return !data
        ? []
        : data.map((favorite: FavoriteData) => favorite.pokemon_id) || [];
    });
  }

  async isFavoritePokemon(id: PokemonId): Promise<boolean> {
    return this.userId().then(async (userId: string | null) => {
      if (!userId) return false;

      const { data } = await this.supabase
        .from('favorites')
        .select('*')
        .match({ user_id: userId, pokemon_id: id })
        .single();

      return !!data;
    });
  }
}
