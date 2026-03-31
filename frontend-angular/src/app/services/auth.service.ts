import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE = 'http://localhost:8080/auth';
  private readonly TOKEN_KEY = 'qma_jwt';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.BASE}/login`, { email, password })
      .pipe(tap(res => localStorage.setItem(this.TOKEN_KEY, res.token)));
  }

  register(
    name: string,
    email: string,
    password: string,
    mobile: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.BASE}/register`, {
      name,
      email,
      password,
      mobile
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
