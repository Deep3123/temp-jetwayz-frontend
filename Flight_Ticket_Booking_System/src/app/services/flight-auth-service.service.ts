import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FlightAuthServiceService {
  // private apiUrl = 'http://localhost:8080/flight'; // Update this if your backend URL is different
  private apiUrl = "https://jetwayz-backend.onrender.com/flight";
  // private apiUrl = 'https://jetwayz-backend-production.up.railway.app/flight';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Get all flights
  getAllFlights(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-all-flights-details`);
  }

  // Get flight details by flight number
  getFlightByFlightNumber(flightNumber: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/get-flights-details-by-flight-number/${flightNumber}`
    );
  }

  // Get flight based on a flight object (departure/arrival/time/date)
  getFlightByAllDetails(flight: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/get-flight-details-by-departure-and-arrival`,
      flight
    );
  }

  // Save new flight details
  saveFlightData(flight: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-flight-details`, flight);
  }

  // Update flight details
  updateFlight(flight: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-flight-details`, flight);
  }

  // Delete flight details by flight number
  deleteFlight(flightNumber: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/delete-flight-details/${flightNumber}`
    );
  }

  // Search flights by route (departure and arrival)
  searchFlightsByRoute(departure: string, arrival: string): Observable<any> {
    const params = new HttpParams()
      .set("departureStation", departure)
      .set("arrivalStation", arrival);

    return this.http.get(
      `${this.apiUrl}/get-flight-details-by-departure-and-arrival`,
      { params }
    );
  }
}
