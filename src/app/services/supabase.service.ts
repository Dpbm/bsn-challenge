import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthError,
  AuthOtpResponse,
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

  // limits per page
  private limit: number = DEFAULT_POKEMONS_PER_PAGE;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get session() {
    /**
     * Access session data.
     */
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  private async getUserData(): Promise<User | null> {
    /**
     * Get user data from session.
     *
     * @returns {Promise<User|null>} - the user data
     */
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    return session?.user || null;
  }

  userId(): Promise<string | null> {
    /**
     * From user data, get the user Id.
     *
     * @returns {Promise<string|null>} - the user id (if not logged, it returns null)
     */
    return this.getUserData().then((user) => user?.id || null);
  }

  email(): Promise<string | null> {
    /**
     * From user data, get the user email.
     *
     * @returns {Promise<string|null>} - the user email (if not logged, it returns null)
     */
    return this.getUserData().then((user) => user?.email || null);
  }

  isLogged(): Promise<boolean> {
    /**
     * Check if the user is logged base on its data.
     *
     * @returns {Promise<boolean>} - Returns true when logged
     */
    return this.getUserData().then((user) => !!user);
  }

  login(email: string): Promise<AuthError | null> {
    /**
     * Tries to login.
     *
     * @returns {Promise<AuthError|null>} - If no error occurs, null is returned
     */

    return this.supabase.auth
      .signInWithOtp({ email })
      .then((res: AuthOtpResponse) => res.error);
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    /**
     * Check for authentication events.
     */
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    /**
     * Signin via magic link.
     */
    return this.supabase.auth.signInWithOtp({ email });
  }

  signOut(): Promise<AuthError | null> {
    /**
     * Try to log the user out.
     *
     * @returns {Promise<AuthError|null>} - if success, it returns null
     */
    return this.supabase.auth
      .signOut()
      .then(({ error }: { error: AuthError | null }) => error);
  }

  addFavoritePokemon(pokemon_id: PokemonId): Promise<PostgrestError | null> {
    /**
     * Add pokemon as favorite into the database.
     *
     * @returns {Promise<PostgrestError|null>} - it returns if succeeded
     */
    return this.userId().then(async (userId: string | null) => {
      if (!userId) return noUserError();

      const { error } = await this.supabase
        .from('favorites')
        .insert({ user_id: userId, pokemon_id });

      return error;
    });
  }

  removeFavoritePokemon(pokemon_id: PokemonId): Promise<PostgrestError | null> {
    /**
     * Removes pokemon as favorite into the database.
     *
     * @returns {Promise<PostgrestError|null>} - it returns if succeeded
     */

    return this.userId().then(async (userId: string | null) => {
      if (!userId) return noUserError();

      const { error } = await this.supabase
        .from('favorites')
        .delete()
        .match({ user_id: userId, pokemon_id });

      return error;
    });
  }

  getFavoritePokemons(offset: number): Promise<PokemonId[]> {
    /**
     * Get a page of favorite pokemons.
     *
     * @returns {Promise<PokemonId[]>} - if an error occurred, an empty list is returned
     */

    return this.userId().then(async (userId: string | null) => {
      if (!userId) return [];

      const { data } = await this.supabase
        .from('favorites')
        .select('pokemon_id')
        .order('pokemon_id', { ascending: true })
        .range(offset, offset + this.limit)
        .match({ user_id: userId });

      return !data
        ? []
        : data.map((favorite: FavoriteData) => favorite.pokemon_id) || [];
    });
  }

  isFavoritePokemon(id: PokemonId): Promise<boolean> {
    /**
     * Check if the current pokemon id is in favorites list.
     *
     * @returns {Promise<boolean>} - by default it returns false.
     */
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
