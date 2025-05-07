import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { map, Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common"; // Import isPlatformBrowser to check the platform

@Injectable({
  providedIn: "root",
})
export class CaptchaServiceService {
  private captchaUrl: string = "https://jetwayz-backend.onrender.com/captcha";
  // private captchaUrl: string = "http://localhost:8080/captcha";
  // private captchaUrl: string = "https://jetwayz-backend-production.up.railway.app/captcha";

  private sessionToken: string | null = null;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    // Check if running in the browser before accessing sessionStorage
    if (isPlatformBrowser(this.platformId)) {
      this.sessionToken = sessionStorage.getItem("X-Auth-Token");
    }
  }

  // Method to fetch a CAPTCHA image (will return a blob)
  getCaptchaImage(): Observable<Blob> {
    // Ensure we are only setting the session token in the browser
    const headers = new HttpHeaders({
      ...(this.sessionToken ? { "X-Auth-Token": this.sessionToken } : {}),
    });

    return this.http
      .get(this.captchaUrl, {
        responseType: "blob",
        withCredentials: true,
        headers: headers,
        observe: "response", // Important to get the full response with headers
      })
      .pipe(
        map((response) => {
          // Store the session token from the response header if available
          const authToken = response.headers.get("X-Auth-Token");
          if (authToken) {
            this.sessionToken = authToken;
            if (isPlatformBrowser(this.platformId)) {
              sessionStorage.setItem("X-Auth-Token", authToken); // Only access sessionStorage in the browser
            }
            // Optionally, you can log the token for debugging
            // console.log("Session token saved:", authToken);
          }
          return response.body as Blob;
        })
      );
  }
}
