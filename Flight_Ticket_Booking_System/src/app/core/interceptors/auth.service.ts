// import { Injectable } from "@angular/core";
// import {
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
//   HttpErrorResponse,
// } from "@angular/common/http";
// import { Observable, throwError } from "rxjs";
// import { catchError, switchMap } from "rxjs/operators";
// import { AuthService } from "../../services/auth-service.service";
// import { Router } from "@angular/router";
// import Swal from "sweetalert2";

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService, private router: Router) { }

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     // Get the token from AuthService
//     const token = this.authService.getToken();

//     // Exclude requests that don't require the token
//     const excludedUrls = [
//       "/user/login",
//       "/user/register",
//       "/user/forgot-password",
//       "/user/reset-password",
//     ];

//     // Get the path part of the URL without query parameters
//     const path = request.url.split("?")[0];
//     // console.log(path);
//     // Check if the current request URL is in the excluded list
//     if (excludedUrls.some((url) => path.includes(url))) {
//       // If the URL is excluded, don't add the Authorization header
//       return next.handle(request);
//     }

//     // If the token exists, add the Authorization header
//     if (token) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // console.log(request);
//     }

//     // Continue with the request
//     return next.handle(request).pipe(
//       // Catch any errors (like 401 unauthorized) after the request is made
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           // Token expired or invalid

//           // If the token is expired, redirect to login
//           this.authService.logout(); // Clear the expired token

//           // Optionally, show a toast or alert for the user (you could use a service like SweetAlert2)
//           // alert("Session expired. Please log in again.");

//           Swal.fire({
//             icon: "info",
//             title: "Login again!",
//             text: "Session expired. Please log in again.",
//             confirmButtonText: "OK",
//           });

//           this.router.navigate(["/login"]); // Redirect to login page

//           return throwError(error); // Rethrow the error so it doesn't propagate further
//         } else if (error.status === 403) {
//           // Token is valid but the user doesn't have access (you can handle 403 as well)
//           // alert("Access denied. You do not have the necessary permissions.");

//           Swal.fire({
//             icon: "info",
//             title: "Permissions denied!",
//             text: "Access denied. You do not have the necessary permissions.",
//             confirmButtonText: "OK",
//           });

//           return throwError(error);
//         }

//         // If it's some other error (like network error), just throw it
//         return throwError(error);
//       })
//     );
//   }
// }

// import { Injectable } from "@angular/core";
// import {
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
//   HttpErrorResponse,
//   HttpResponse,
// } from "@angular/common/http";
// import { Observable, throwError } from "rxjs";
// import { catchError, map } from "rxjs/operators";
// import { AuthService } from "../../services/auth-service.service";
// import { Router } from "@angular/router";
// import Swal from "sweetalert2";
// import { EncryptionService } from "../../services/encryption.service";

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private encryptionService: EncryptionService
//   ) {}

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const token = this.authService.getToken();
//     const excludedUrls = [
//       "/user/login",
//       "/user/register",
//       "/user/forgot-password",
//       "/user/reset-password",
//     ];
//     const path = request.url.split("?")[0];

//     let clonedRequest = request;

//     // Only encrypt if it's a request with a body and not in excluded URLs
//     if (!excludedUrls.some((url) => path.includes(url)) && request.body) {
//       const encryptedBody = this.encryptionService.encrypt(
//         JSON.stringify(request.body)
//       );
//       clonedRequest = request.clone({
//         body: encryptedBody,
//         setHeaders: {
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           "Content-Type": "application/json",
//         },
//       });
//     } else if (token) {
//       clonedRequest = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     }

//     return next.handle(clonedRequest).pipe(
//       map((event) => {
//         // Decrypt the response body
//         if (event instanceof HttpResponse && typeof event.body === "string") {
//           try {
//             const decrypted = this.encryptionService.decrypt(event.body);
//             return event.clone({ body: JSON.parse(decrypted) });
//           } catch (e) {
//             // If not encrypted or decryption fails, just return original response
//             return event;
//           }
//         }
//         return event;
//       }),
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           this.authService.logout();
//           Swal.fire({
//             icon: "info",
//             title: "Login again!",
//             text: "Session expired. Please log in again.",
//             confirmButtonText: "OK",
//           });
//           this.router.navigate(["/login"]);
//         } else if (error.status === 403) {
//           Swal.fire({
//             icon: "info",
//             title: "Permissions denied!",
//             text: "Access denied. You do not have the necessary permissions.",
//             confirmButtonText: "OK",
//           });
//         }
//         return throwError(error);
//       })
//     );
//   }
// }

import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthService } from "../../services/auth-service.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { EncryptionService } from "../../services/encryption.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private encryptionService: EncryptionService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const excludedUrls = [
      "/user/login",
      "/user/register",
      "/user/forgot-password",
      "/user/reset-password",
    ];

    const path = request.url.split("?")[0]; // Strip query parameters for matching

    let clonedRequest = request;

    // Encrypt the body of every request that has a body
    if (request.body) {
      const encryptedBody = this.encryptionService.encrypt(
        JSON.stringify(request.body)
      );
      clonedRequest = request.clone({
        body: encryptedBody,
        setHeaders: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "text/plain", // Change to text/plain for encrypted content
        },
      });
    } else if (token && !excludedUrls.some((url) => path.includes(url))) {
      // Add Authorization header only if the request is not in the excluded list
      clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(clonedRequest).pipe(
      map((event) => {
        // Decrypt the response body if it's encrypted
        if (event instanceof HttpResponse && typeof event.body === "string") {
          try {
            const decrypted = this.encryptionService.decrypt(event.body);
            // Parse the decrypted JSON only if it's a valid JSON string
            try {
              return event.clone({ body: JSON.parse(decrypted) });
            } catch (jsonError) {
              console.error("JSON parsing error:", jsonError);
              return event.clone({ body: decrypted });
            }
          } catch (e) {
            console.error("Decryption error:", e);
            return event;
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        // Special handling for the case where the response is encrypted but Angular tried to parse it as JSON
        if (
          error.status === 200 ||
          error.status === 201 ||
          error.status === 202 ||
          error.status === 400 ||
          error.status === 401
        ) {
          if (error.error && error.error.text) {
            try {
              const decrypted = this.encryptionService.decrypt(
                error.error.text
              );
              return new Observable<HttpEvent<any>>((observer) => {
                observer.next(
                  new HttpResponse<any>({
                    body: JSON.parse(decrypted),
                    status: error.status,
                    headers: error.headers,
                    url: error.url || undefined,
                  })
                );
                observer.complete();
              });
            } catch (e) {
              console.error("Failed to decrypt response:", e);
            }
          }
        }

        if (error.status === 401) {
          // Token expired or invalid
          this.authService.logout();
          Swal.fire({
            icon: "info",
            title: "Login again!",
            text: "Session expired. Please log in again.",
            confirmButtonText: "OK",
          });
          this.router.navigate(["/login"]);
        } else if (error.status === 403) {
          // Forbidden, handle as necessary
          Swal.fire({
            icon: "info",
            title: "Permissions denied!",
            text: "Access denied. You do not have the necessary permissions.",
            confirmButtonText: "OK",
          });
        }
        return throwError(error);
      })
    );
  }
}
