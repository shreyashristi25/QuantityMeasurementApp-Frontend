import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AuthComponent } from './pages/auth/auth';
import { HistoryComponent } from './pages/history/history';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'auth/callback', component: AuthComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: '' }
];
