import { Routes } from '@angular/router';
import { PokemonComponent } from './pokemon/pokemon.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { isLoggedGuard } from './guards/is-logged.guard';
import { isNotLoggedGuard } from './guards/is-not-logged.guard';

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
    canActivate: [isNotLoggedGuard],
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [isLoggedGuard],
  },
];
