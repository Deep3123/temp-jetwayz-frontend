import { HttpClient } from "@angular/common/http";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class BookingServiceService {
  private apiUrl: string = "https://jetwayz-backend.onrender.com/bookings";
  // private apiUrl: string = "http://localhost:8080/bookings"; // Local dev API endpoint
  // private apiUrl: string = "https://jetwayz-backend-production.up.railway.app/bookings";

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  verifyPayment(bookingData: any): Observable<any> {
    if (this.isBrowser()) {
      return this.http.post(`${this.apiUrl}/verify-payment`, bookingData);
    }
    return new Observable();
  }

  createBooking(bookingData: any): Observable<any> {
    if (this.isBrowser()) {
      return this.http.post(`${this.apiUrl}/confirm`, bookingData);
    }
    return new Observable();
  }

  generatePdfOfTicket(bookingData: any): Observable<any> {
    if (this.isBrowser()) {
      return this.http.post(`${this.apiUrl}/generate-ticket`, bookingData);
    }
    return new Observable();
  }

  getBookingById(id: string): Observable<any> {
    if (this.isBrowser()) {
      return this.http.get(`${this.apiUrl}/${id}`);
    }
    return new Observable();
  }

  getUserBookings(): Observable<any> {
    if (this.isBrowser()) {
      return this.http.get(`${this.apiUrl}/user`);
    }
    return new Observable();
  }

  getAllBookings(): Observable<any> {
    if (this.isBrowser()) {
      return this.http.get(`${this.apiUrl}/all-bookings`);
    }
    return new Observable();
  }

  deleteBooking(id: any): Observable<any> {
    if (this.isBrowser()) {
      return this.http.post(`${this.apiUrl}/delete-booking-details`, id);
    }
    return new Observable();
  }
}
