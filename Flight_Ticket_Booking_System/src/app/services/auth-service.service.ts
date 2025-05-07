import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedInSubject!: BehaviorSubject<boolean>;
  isLoggedIn$ = this.isLoggedInSubject?.asObservable();

  private isAdminSubject!: BehaviorSubject<boolean>;
  isAdmin$ = this.isAdminSubject?.asObservable();

  private readonly TOKEN_KEY = "token";
  private readonly ROLE_KEY = "role";
  private readonly REMEMBER_ME_KEY = "rememberMe";

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const isLoggedIn = this.hasToken();
    const isAdmin = this.isAdmin();

    this.isLoggedInSubject = new BehaviorSubject<boolean>(isLoggedIn);
    this.isAdminSubject = new BehaviorSubject<boolean>(isAdmin);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getStorage(): Storage | null {
    if (!this.isBrowser()) return null;
    try {
      const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === "true";
      return rememberMe ? localStorage : sessionStorage;
    } catch (error) {
      console.error("Error accessing storage: ", error);
      return null;
    }
  }

  login(token: string, role: string, rememberMe: boolean = false): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem(this.REMEMBER_ME_KEY, String(rememberMe));
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.TOKEN_KEY, token);
        storage.setItem(this.ROLE_KEY, role);

        this.isLoggedInSubject.next(true);
        this.isAdminSubject.next(role === "ADMIN");
      } catch (error) {
        console.error("Storage error during login:", error);
      }
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      try {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ROLE_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.ROLE_KEY);

        this.isLoggedInSubject.next(false);
        this.isAdminSubject.next(false);
      } catch (error) {
        console.error("Storage error during logout:", error);
      }
    }
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    try {
      return (
        localStorage.getItem(this.TOKEN_KEY) ||
        sessionStorage.getItem(this.TOKEN_KEY)
      );
    } catch (error) {
      console.error("Error reading token: ", error);
      return null;
    }
  }

  getRole(): string | null {
    if (!this.isBrowser()) return null;
    try {
      return (
        localStorage.getItem(this.ROLE_KEY) ||
        sessionStorage.getItem(this.ROLE_KEY)
      );
    } catch (error) {
      console.error("Error reading role: ", error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private hasToken(): boolean {
    const token = this.getToken();
    const role = this.getRole();
    return !!token && !!role;
  }

  private isAdmin(): boolean {
    const role = this.getRole();
    return role === "ADMIN";
  }
}
