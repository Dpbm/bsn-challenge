import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import {
  IonInput,
  IonButton,
  IonToast,
  IonContent,
  IonText,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import * as z from 'zod/v4-mini';
import { AuthError } from '@supabase/supabase-js';

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
  imports: [
    IonInput,
    IonButton,
    IonToast,
    IonContent,
    IonText,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonToolbar,
  ],
})
export class LoginComponent {
  email: string = '';
  disabled: boolean = true;

  // toast status
  errorLoginToastIsOpen: boolean = false;
  successLoginToastIsOpen: boolean = false;

  constructor(private supabase: SupabaseService) {}

  inputChange(event: any) {
    /**
     * Check email data
     */
    try {
      const email = event.target?.value || '';
      checkEmail(email);
      this.email = email;
      this.disabled = false;
    } catch (error) {
      this.disabled = true;
    }
  }

  login() {
    /**
     * Tries to login with the provided
     * email.
     */
    this.disabled = true;
    this.supabase.login(this.email).then((error: AuthError | null) => {
      if (error) {
        this.disabled = false;
        this.errorLoginToastIsOpen = true;
        return;
      }

      this.successLoginToastIsOpen = true;
    });
  }

  closeToast() {
    /**
     * Helper function to close toasts.
     */
    this.errorLoginToastIsOpen = false;
    this.successLoginToastIsOpen = false;
  }
}
