import { Component } from '@angular/core';
import {
  IonHeader,
  IonBackButton,
  IonButtons,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss'],
  imports: [IonBackButton, IonHeader, IonButtons, IonToolbar],
})
export class BackComponent {
  rootComponent = HomeComponent;
  constructor() {}
}
