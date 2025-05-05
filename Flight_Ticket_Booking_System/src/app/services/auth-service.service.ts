import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin());
  isAdmin$ = this.isAdminSubject.asObservable();

  // Storage type keys
  private readonly TOKEN_KEY = "token";
  private readonly ROLE_KEY = "role";
  private readonly REMEMBER_ME_KEY = "rememberMe";

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if the user was previously logged in
    this.restoreSession();
  }

  // Restore session on service initialization
  private restoreSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      const role = this.getRole();
      if (token && role) {
        this.isLoggedInSubject.next(true);
        this.isAdminSubject.next(role === "ADMIN");
      }
    }
  }

  // Private method to check if the token and role exist in storage
  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      const role = this.getRole();
      return !!token && !!role;
    }
    return false;
  }

  // Private method to check if the user is an admin
  private isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const role = this.getRole();
      return role === "ADMIN";
    }
    return false;
  }

  // Helper method to check if the code is running in the browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Get the appropriate storage based on remember me setting
  private getStorage(): any {
    if (!this.isBrowser()) return null;

    // Check if remember me was set to true
    const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === "true";
    return rememberMe ? localStorage : sessionStorage;
  }

  // Login method to store token and role
  login(token: string, role: string, rememberMe: boolean = false): void {
    if (this.isBrowser()) {
      // Store rememberMe preference in localStorage so it persists
      localStorage.setItem(this.REMEMBER_ME_KEY, String(rememberMe));

      // Store token and role in the appropriate storage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.TOKEN_KEY, token);
      storage.setItem(this.ROLE_KEY, role);

      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(role === "ADMIN");
    }
  }

  // Logout method to clear token and role from storage
  logout(): void {
    if (this.isBrowser()) {
      // Clear from both storages to be safe
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ROLE_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.ROLE_KEY);

      // Keep the rememberMe preference
      this.isLoggedInSubject.next(false);
      this.isAdminSubject.next(false);
    }
  }

  // Get the stored token
  getToken(): string | null {
    if (!this.isBrowser()) return null;

    // Try localStorage first (for remembered sessions)
    let token = localStorage.getItem(this.TOKEN_KEY);

    // If not found, try sessionStorage
    if (!token) {
      token = sessionStorage.getItem(this.TOKEN_KEY);
    }

    return token;
  }

  // Get the stored role
  getRole(): string | null {
    if (!this.isBrowser()) return null;

    // Try localStorage first (for remembered sessions)
    let role = localStorage.getItem(this.ROLE_KEY);

    // If not found, try sessionStorage
    if (!role) {
      role = sessionStorage.getItem(this.ROLE_KEY);
    }

    return role;
  }

  // Check if the user is authenticated by checking the token
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
