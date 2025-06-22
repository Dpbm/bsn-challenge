import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class isNotLoggedGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<GuardResult> {
    /**
     * Checks supabase session. If it exists, the user is logged
     * so, he must not access some areas (like login page).
     *
     * @returns {Observable<bool>}
     */

    return this.supabase.isLogged().then((logged: boolean) => {
      if (!logged) {
        return true;
      }

      this.router.navigate(['/']);
      return false;
    });
  }
}
