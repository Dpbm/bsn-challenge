import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SupabaseService } from './services/supabase.service';
import { Session } from '@supabase/supabase-js';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ReactiveFormsModule],
})
export class AppComponent implements OnInit {
  session: Session | null = this.supabase.session;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit(): void {
    this.supabase.authChanges((_, session) => (this.session = session));
  }
}
