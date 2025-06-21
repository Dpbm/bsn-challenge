import { Routes } from '@angular/router';
import { PokemonComponent } from './pokemon/pokemon.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'pokemon/:id',
    component: PokemonComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
