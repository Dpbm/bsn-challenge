import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonNav } from '@ionic/angular/standalone';
import { SupabaseService } from './services/supabase.service';
import { Session } from '@supabase/supabase-js';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ReactiveFormsModule, IonNav],
})
export class AppComponent implements OnInit {
  session: Session | null = this.supabase.session;

  rootComponent = HomeComponent;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit(): void {
    this.supabase.authChanges((_, session) => (this.session = session));
  }
}
