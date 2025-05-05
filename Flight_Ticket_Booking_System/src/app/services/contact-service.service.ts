import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContactServiceService {
  // private baseUrl: string = "http://localhost:8080/contact"; // Make sure this is the correct API base URL
  private baseUrl: string = "https://jetwayz-backend.onrender.com/contact";
  // private baseUrl: string = "https://jetwayz-backend-production.up.railway.app/contact";

  constructor(private http: HttpClient) {}

  saveContactData(object: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-contact-us-details`, object);
  }

  getContactDataByName(name: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/get-all-contact-us-details-by-name/${name}`
    );
  }

  getAllContactData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-contact-us-details`);
  }

  deleteContact(obj: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete-contact-us-details`, obj);
  }
}
