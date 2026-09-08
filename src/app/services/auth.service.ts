import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly loggedIn = signal(!!sessionStorage.getItem('token'));

  login(token: string): void {
    sessionStorage.setItem('token', token);
    this.loggedIn.set(true);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.loggedIn.set(false);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
