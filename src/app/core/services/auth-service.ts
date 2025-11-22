import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Credentials } from '../models/Credentials';
import { ResponseResult } from '../models/ResponseResult';
import { TokenPayload } from '../models/TokenPayload';
import { jwtDecode } from 'jwt-decode';
import { ConfigService } from './config-service';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private router = inject(Router);
  private apiUrl = `${this.config.apiUrl}/access`;

  private getInitialAuthState() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const decodedToken = this.decodeToken(token);

      // Check if token is valid and not expired
      if (decodedToken && this.isTokenValid(decodedToken)) {
        return { isLoggedIn: true, userData: decodedToken };
      } else {
        // Token is invalid or expired, clear it
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    return { isLoggedIn: false, userData: null };
  }

  #authState = signal(this.getInitialAuthState());

  public isLoggedIn = computed(() => this.#authState().isLoggedIn);
  public userPrivileges = computed(() => this.#authState().userData?.privileges);

  // The login method
  public login(credentials: Credentials): Observable<ResponseResult<string>> {
    return this.http.post<ResponseResult<string>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.statusCode === 200 && response.result) {
          localStorage.clear();
          // Save the token
          localStorage.setItem(TOKEN_KEY, response.result);
          // Decode the token and update the auth state signal
          const decodedToken = this.decodeToken(response.result);
          this.#authState.set({ isLoggedIn: true, userData: decodedToken });
        }
      })
    );
  }
  private decodeToken(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }

  private isTokenValid(payload: TokenPayload | null): boolean {
    if (!payload || !payload.exp) {
      return false;
    }
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // The logout method
  public logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.#authState.set({ isLoggedIn: false, userData: null });
    this.router.navigate(['auth/login']);
  }


}
