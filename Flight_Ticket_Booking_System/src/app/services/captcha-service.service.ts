import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CaptchaServiceService {
  // private captchaUrl: string = "http://localhost:8080/captcha";
  private captchaUrl: string = "https://jetwayz-backend.onrender.com/captcha";
  // private captchaUrl: string =
  //   "https://jetwayz-backend-production.up.railway.app/captcha";

  // constructor(private http: HttpClient) {}

  // // Method to fetch a CAPTCHA image (will return a blob)
  // getCaptchaImage(): Observable<Blob> {
  //   return this.http.get(this.captchaUrl, {
  //     responseType: "blob",
  //     withCredentials: true,
  //   });
  // }

  private sessionToken: string | null = null;

  // constructor(private http: HttpClient) {
  //   // Try to get existing session token from storage
  //   this.sessionToken = sessionStorage.getItem("X-Auth-Token");
  // }

  constructor(private http: HttpClient) {
    // Check if running in the browser before accessing sessionStorage
    if (typeof window !== "undefined") {
      this.sessionToken = sessionStorage.getItem("X-Auth-Token");
    }
  }

  // Method to fetch a CAPTCHA image (will return a blob)
  // getCaptchaImage(): Observable<Blob> {
  //   const headers = new HttpHeaders({
  //     // Include the session token if it exists
  //     ...(this.sessionToken ? { "X-Auth-Token": this.sessionToken } : {}),
  //   });

  //   return this.http
  //     .get(this.captchaUrl, {
  //       responseType: "blob",
  //       withCredentials: true,
  //       headers: headers,
  //       observe: "response",
  //     })
  //     .pipe(
  //       map((response) => {
  //         // Store the session token if it's in the response
  //         const authToken = response.headers.get("X-Auth-Token");
  //         if (authToken) {
  //           this.sessionToken = authToken;
  //           sessionStorage.setItem("X-Auth-Token", authToken);
  //         }
  //         return response.body as Blob;
  //       })
  //     );
  // }

  getCaptchaImage(): Observable<Blob> {
    const headers = new HttpHeaders({
      // Include the session token if it exists
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
          // Store the session token from the response header
          const authToken = response.headers.get("X-Auth-Token");
          if (authToken) {
            this.sessionToken = authToken;
            sessionStorage.setItem("X-Auth-Token", authToken);
            // console.log("Session token saved:", authToken);
          }
          return response.body as Blob;
        })
      );
  }
}
