import { HttpClient } from "@angular/common/http";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContactServiceService {
  private baseUrl: string = "https://jetwayz-backend.onrender.com/contact";

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  saveContactData(object: any): Observable<any> {
    if (!this.isBrowser()) return new Observable(); // Avoid making HTTP requests on server
    return this.http.post(`${this.baseUrl}/save-contact-us-details`, object);
  }

  getContactDataByName(name: any): Observable<any> {
    if (!this.isBrowser()) return new Observable();
    return this.http.get(
      `${this.baseUrl}/get-all-contact-us-details-by-name/${name}`
    );
  }

  getAllContactData(): Observable<any> {
    if (!this.isBrowser()) return new Observable();
    return this.http.get(`${this.baseUrl}/get-all-contact-us-details`);
  }

  deleteContact(obj: any): Observable<any> {
    if (!this.isBrowser()) return new Observable();
    return this.http.post(`${this.baseUrl}/delete-contact-us-details`, obj);
  }
}
