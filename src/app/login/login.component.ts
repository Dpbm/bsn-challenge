import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import {
  IonInput,
  IonButton,
  IonToast,
  IonContent,
  IonText,
} from '@ionic/angular/standalone';
import { BackComponent } from '../back/back.component';
import * as z from 'zod/v4-mini';

const checkEmail = (email: string) =>
  z
    .object({
      email: z.email(),
    })
    .parse({ email });

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonInput, IonButton, IonToast, IonContent, BackComponent, IonText],
})
export class LoginComponent {
  email: string = '';
  disabled: boolean = true;
  errorLoginToastIsOpen: boolean = false;
  successLoginToastIsOpen: boolean = false;

  constructor(private supabase: SupabaseService) {}

  inputChange(event: any) {
    const email = event.target.value;
    try {
      checkEmail(email);
      this.email = email;
      this.disabled = false;
    } catch (error) {
      this.disabled = true;
    }
  }

  async login() {
    this.disabled = true;
    const error = await this.supabase.login(this.email);

    if (error) {
      this.disabled = false;
      this.errorLoginToastIsOpen = true;
      return;
    }

    this.successLoginToastIsOpen = true;
  }

  closeToast() {
    this.errorLoginToastIsOpen = false;
    this.successLoginToastIsOpen = false;
  }
}
