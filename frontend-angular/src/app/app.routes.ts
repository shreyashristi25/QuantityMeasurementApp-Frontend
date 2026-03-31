import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AuthComponent } from './pages/auth/auth';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '' }
];
