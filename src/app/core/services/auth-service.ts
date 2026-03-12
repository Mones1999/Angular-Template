import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { Credentials } from '../models/Credentials';
import { ResponseResult } from '../models/ResponseResult';
import { TokenPayload } from '../models/TokenPayload';
import { jwtDecode } from 'jwt-decode';
import { ConfigService } from './config-service';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../constants/app-routes-constants';
import { AUTH_ROUTES } from '@features/auth/constants/auth-routes-constants';


const TOKEN_KEY = 'auth-token';

// Mock credentials for development/testing
const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

// Flag to enable mock login (set to true for testing)
const ENABLE_MOCK_LOGIN = true;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private router = inject(Router);
  private apiUrl = `${this.config.apiUrl}/access`;

  private getInitialAuthState() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      const decodedToken = this.decodeToken(token);

      // Check if token is valid and not expired
      if (decodedToken && this.isTokenValid(decodedToken)) {
        return { isLoggedIn: true, userData: decodedToken };
      } else {
        // Token is invalid or expired, clear it
        sessionStorage.removeItem(TOKEN_KEY);
      }
    }
    return { isLoggedIn: false, userData: null };
  }

  #authState = signal(this.getInitialAuthState());

  public isLoggedIn = computed(() => this.#authState().isLoggedIn);
  public userPrivileges = computed(() => this.#authState().userData?.privileges);

  // The login method
  public login(credentials: Credentials): Observable<ResponseResult<string>> {
    // Check if mock login is enabled
    if (ENABLE_MOCK_LOGIN && credentials.username === MOCK_CREDENTIALS.username && credentials.password === MOCK_CREDENTIALS.password) {
      const mockToken = this.generateMockToken();
      const mockResponse: ResponseResult<string> = {
        statusCode: 200,
        result: mockToken,
        statusDescription: 'Mock login successful'
      };

      return of(mockResponse).pipe(
        tap((response) => {
          if (response.statusCode === 200 && response.result) {
            sessionStorage.clear();
            // Save the token
            sessionStorage.setItem(TOKEN_KEY, response.result);
            // Decode the token and update the auth state signal
            const decodedToken = this.decodeToken(response.result);
            this.#authState.set({ isLoggedIn: true, userData: decodedToken });
          }
        })
      );
    }

    // Normal API login
    return this.http.post<ResponseResult<string>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.statusCode === 200 && response.result) {
          sessionStorage.clear();
          // Save the token
          sessionStorage.setItem(TOKEN_KEY, response.result);
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

  // Generate a mock JWT token for testing
  private generateMockToken(): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      privileges: ['READ', 'WRITE', 'DELETE', 'ADMIN'],
      isNeedChangePassword: false,
      firstLogin: false,
      enableCopyPasteInWeb: true,
      groupId: 1,
      name: 'Admin User',
      sessionId: 'mock-session-' + Math.random().toString(36).substr(2, 9),
      showChangePasswordReminder: false,
      userId: 1,
      isTwoFactorAuthApplied: false,
      exp: now + (24 * 60 * 60) // Expires in 24 hours
    };

    // Encode header and payload to base64
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    // Create a fake signature (for demonstration purposes)
    const signature = btoa('mocksignature');

    // Return the mock JWT token
    return `${encodedHeader}.${encodedPayload}.${signature}`;
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
    return sessionStorage.getItem(TOKEN_KEY);
  }

  // The logout method
  public logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.#authState.set({ isLoggedIn: false, userData: null });
    this.router.navigate([APP_ROUTES.AUTH, AUTH_ROUTES.LOGIN]);
  }


}
