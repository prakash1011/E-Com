import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  access_token: string;
  user?: any;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly ACCESS_TOKEN = 'jwt_token';
  private readonly API_LOGIN = 'http://localhost:3000/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.API_LOGIN, credentials).pipe(
      tap((res) => {
        this.saveToken(res.access_token);
      })
    );
  }

  saveToken(access_token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, access_token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
  }
}
