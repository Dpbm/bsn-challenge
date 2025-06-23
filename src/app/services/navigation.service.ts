import { Injectable } from '@angular/core';
import { IonNav } from '@ionic/angular/standalone';
import { LoginComponent } from '../login/login.component';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private nav!: IonNav;

  setNav(nav: IonNav) {
    this.nav = nav;
  }

  async goToLogin() {
    this.nav.popToRoot().then((success) => {
      if (!success) {
        return;
      }
      this.nav.push(LoginComponent);
    });
  }
}
