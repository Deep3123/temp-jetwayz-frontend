import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BookingServiceService {
  // private apiUrl: string = "http://localhost:8080/bookings"; // Change to your actual API endpoint
  private apiUrl: string = "https://jetwayz-backend.onrender.com/bookings";
  // private apiUrl: string = "https://jetwayz-backend-production.up.railway.app/bookings";

  constructor(private http: HttpClient) {}

  verifyPayment(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-payment`, bookingData);
  }

  // Create a new booking
  createBooking(bookingData: any): Observable<any> {
    // return this.http.post(`${this.apiUrl}/confirm`, bookingData, {
    //   responseType: "text",
    // });

    return this.http.post(`${this.apiUrl}/confirm`, bookingData);
  }

  generatePdfOfTicket(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-ticket`, bookingData);
  }

  // Get booking by ID
  getBookingById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Get all bookings for a user (assuming user authentication is implemented)
  getUserBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-bookings`);
  }

  deleteBooking(id: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-booking-details`, id);
  }
}
