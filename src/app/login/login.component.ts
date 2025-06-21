import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { IonInput, IonButton, IonToast } from '@ionic/angular/standalone';
import * as z from 'zod/v4';

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
  imports: [IonInput, IonButton, IonToast],
})
export class LoginComponent implements OnInit {
  email: string = '';
  disabled: boolean = true;
  errorLoginToastIsOpen: boolean = false;
  successLoginToastIsOpen: boolean = false;

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {}

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
