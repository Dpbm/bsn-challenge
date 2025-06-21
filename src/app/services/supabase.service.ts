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
import { BehaviorSubject } from 'rxjs';
import { PokemonId } from '@customTypes/pokemon';
export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;
  isLogged: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.authChanges((_, session) => {
      this.isLogged.next(!!session);
    });
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();
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

    if (!error) {
      this.isLogged.next(false);
    }

    return error;
  }

  async addFavoritePokemon(id: PokemonId): Promise<PostgrestError | null> {
    const { error } = await this.supabase
      .from('favorites')
      .insert({ user_id: this.session?.user.id, pokemon_id: id });

    return error;
  }

  async removeFavoritePokemon(id: PokemonId): Promise<PostgrestError | null> {
    const { error } = await this.supabase
      .from('favorites')
      .delete()
      .match({ user_id: this.session?.user.id, pokemon_id: id });
    return error;
  }
}
