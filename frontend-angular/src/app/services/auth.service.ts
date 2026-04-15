import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE = `${environment.apiBaseUrl}/auth`;
  private readonly TOKEN_KEY = 'qma_jwt';
  private googleAuthUrl = `${environment.apiBaseUrl}/login/oauth2/code/google`;

  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<{ token: string }>(`${this.BASE}/login`, { email, password }, { headers })
      .pipe(
        tap(res => this.setToken(res.token)),
        timeout(10000)
      );
  }

  register(
    name: string,
    email: string,
    password: string,
    mobile: string
  ): Observable<{ message: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ message: string }>(`${this.BASE}/register`, { name, email, password, mobile }, { headers })
      .pipe(timeout(10000));
  }

  googleLogin(): void {
    window.location.href = this.googleAuthUrl;
  }

  handleGoogleCallback(token: string): void {
    this.setToken(token);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.logout();
        return false;
      }
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSubject.next(null);
  }
}
