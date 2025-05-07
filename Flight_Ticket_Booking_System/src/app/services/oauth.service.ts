import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class OAuthService {
    // private baseUrl: string = "http://localhost:8080"; // Change to your actual API endpoint
    private baseUrl: string = "https://jetwayz-backend.onrender.com";
    // private baseUrl: string = "https://jetwayz-backend-production.up.railway.app";
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Complete profile after OAuth login
  completeOAuthProfile(profileData: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(
      `${this.baseUrl}/oauth/complete-profile`,
      profileData,
      { headers }
    );
  }
}
