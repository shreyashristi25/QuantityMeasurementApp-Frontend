import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface HistoryOperation {
  id?: number;
  username?: string;
  timestamp?: string;
  operation: string;
  operand1: string;
  operand2?: string; // Optional since conversion might not have operand2 sometimes
  result: string;
  errorMessage?: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly BASE = `${environment.apiBaseUrl}/api/v1/history`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('HistoryService: Token value:', token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getHistory(): Observable<HistoryOperation[]> {
    const token = this.authService.getToken();
    console.log('HistoryService: Getting history with token:', token ? 'present' : 'missing');
    return this.http.get<HistoryOperation[]>(this.BASE, {
      headers: this.getHeaders()
    });
  }

  logOperation(operation: HistoryOperation): Observable<HistoryOperation> {
    return this.http.post<HistoryOperation>(this.BASE, operation, {
      headers: this.getHeaders()
    });
  }
}
