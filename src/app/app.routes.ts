import { Routes } from '@angular/router';
import { PokemonComponent } from './pokemon/pokemon.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  // },
  {
    path: 'pokemon/:id',
    pathMatch: 'prefix',
    component: PokemonComponent,
  },
];
