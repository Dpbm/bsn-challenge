import { CanActivate, GuardResult } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Injectable } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Injectable({ providedIn: 'root' })
export class isLoggedGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private navigation: NavigationService
  ) {}

  canActivate(): Promise<GuardResult> {
    /**
     * Checks supabase session. If it exists, the user is logged
     * so, he can continue his navigation.
     *
     * @returns {Promise<bool>} - True if he's logged
     */

    return this.supabase.isLogged().then((logged: boolean) => {
      if (!logged) {
        this.navigation.goToLogin();
      }
      return logged;
    });
  }
}
