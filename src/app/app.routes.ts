import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Game } from './features/game/game';
import { Summary } from './features/summary/summary';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'game', component: Game },
  { path: 'summary', component: Summary },
  { path: '**', redirectTo: '' }
];