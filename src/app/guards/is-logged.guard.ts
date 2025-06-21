import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class isLoggedGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<GuardResult> {
    /**
     * Checks supabase session. If it exists, the user is logged
     * so, he can continue his navigation.
     *
     * @returns {Observable<bool>}
     */

    return this.supabase.isLogged.pipe(
      map((value: boolean) => {
        if (!value) {
          this.router.navigate(['/login']);
        }

        return value;
      })
    );
  }
}
