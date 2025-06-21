import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class isNotLoggedGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    /**
     * Checks supabase session. If it exists, the user is logged
     * so, he must not access some areas (like login page).
     *
     * @returns {Observable<bool>}
     */

    return this.supabase.isLogged.pipe(
      map((value: boolean) => {
        if (value) {
          this.router.navigate(['/']);
        }

        return !value;
      })
    );
  }
}
