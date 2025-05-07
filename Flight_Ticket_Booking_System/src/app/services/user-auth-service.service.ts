import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth-service.service";

@Injectable({
  providedIn: "root",
})
export class UserAuthServiceService {
  // private baseUrl: string = "http://localhost:8080/user"; // Make sure this is the correct API base URL
  private baseUrl: string = "https://jetwayz-backend.onrender.com/user";
  // private baseUrl: string =
  //   "https://jetwayz-backend-production.up.railway.app/user";

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getSessionToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem("X-Auth-Token");
    }
    return null;
  }

  saveUserData(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  userLogin(params: any): Observable<any> {
    const token = this.getSessionToken();
    const headers = token
      ? new HttpHeaders({ "X-Auth-Token": token })
      : new HttpHeaders();

    return this.http.post<any>(`${this.baseUrl}/login`, params, {
      headers,
      withCredentials: true,
    });
  }

  forgotPassword(params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, params);
  }

  resetPassword(
    resetPassword: any,
    username: string,
    timestamp: string,
    token: string
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reset-password/${username}/${timestamp}/${token}`,
      resetPassword
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-user-details`);
  }

  getUsersPaginated(
    page: number,
    size: number,
    sortField: string | null,
    sortDirection: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString());

    if (sortField) {
      params = params
        .set("sortField", sortField)
        .set("sortDirection", sortDirection);
    }

    return this.http.get(`${this.baseUrl}/get-users-paginated`, { params });
  }

  getTotalUsersCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-total-users-count`);
  }

  deleteUser(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/delete-user-by-username/${username}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-user-by-username`, user);
  }
}
