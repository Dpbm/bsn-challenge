import { Injectable } from '@angular/core';
import { IonNav } from '@ionic/angular/standalone';
import { LoginComponent } from '../login/login.component';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private nav!: IonNav; // uses the root nav

  setNav(nav: IonNav) {
    /**
     * Sets the nav component instance.
     */
    this.nav = nav;
  }

  goToLogin() {
    /**
     * Clear everything and go directly to login page.
     */
    this.nav.popToRoot().then((success) => {
      if (!success) {
        return;
      }
      this.nav.push(LoginComponent);
    });
  }

  goToHome() {
    /**
     * Push on stack the home page (root).
     */
    this.nav.push('/');
  }
}
