import { CanActivate, GuardResult } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Injectable } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Injectable({ providedIn: 'root' })
export class isNotLoggedGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private navigation: NavigationService
  ) {}

  canActivate(): Promise<GuardResult> {
    /**
     * Checks supabase session. If it exists, the user is logged
     * so, he must not access some areas (like login page).
     *
     * @returns {Promise<bool>} - True if user is not logged
     */

    return this.supabase.isLogged().then((logged: boolean) => {
      if (logged) {
        this.navigation.goToHome();
      }

      return !logged;
    });
  }
}
