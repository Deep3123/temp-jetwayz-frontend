import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-flight-results",
  standalone: false,
  templateUrl: "./flight-results.component.html",
  styleUrls: ["./flight-results.component.css"],
})
export class FlightResultsComponent implements OnInit {
  flightResults: any[] = [];
  count: any;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.flightResults = nav?.extras?.state?.["flights"] || [];
    this.count = nav?.extras?.state?.["count"] || 0;
  }

  ngOnInit(): void {
    // You can handle cases like no results here
    console.log(this.flightResults); // Check the structure of your flightResults array

    // this.sortFlights("lowestPrice");

    if (this.flightResults?.length > 0) {
      this.sortFlights("lowestPrice");
    }
  }

  // Format duration (convert minutes into hours and minutes)
  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} hrs ${minutes} mins`;
  }

  // Get the airport name based on the airport code
  getAirportName(airportCode: string): string {
    const airportNames: { [key: string]: string } = {
      Ahmedabad: "AMD",
      Bangalore: "BLR",
      Chennai: "MAA",
      Delhi: "DEL",
      Hyderabad: "HYD",
      Kolkata: "CCU",
      Mumbai: "BOM",
      Pune: "PNQ",
      Jaipur: "JAI",
      Kochi: "COK",
      Lucknow: "LKO",
      Chandigarh: "IXC",
      Surat: "STV",
      Goa: "GOI",
      Indore: "IDR",
      Bhopal: "BHO",
      Vishakhapatnam: "VTZ",
      Mangalore: "IXE",
      Madurai: "IXM",
      Varanasi: "VNS",
      Patna: "PAT",
      Agra: "AGR",
      Bhubaneswar: "BBI",
      Tiruchirappalli: "TRZ",
      Imphal: "IMF",
      Manali: "MJL",
      Gorakhpur: "GOP",
      Ranchi: "IXR",
      Jodhpur: "JDR",
      Jabalpur: "JLR",
      Aurangabad: "IXU",
      Dehradun: "DED",
      Guwahati: "GAU",
      Raipur: "RPR",
      Vadodara: "BDQ",
      Nagpur: "NAG",
      Gaya: "GAY",
      Udaipur: "UDR",
      Leh: "IXL",
      Dibrugarh: "DBR",
      Silchar: "IXS",
      Agartala: "IXA",
      Belagavi: "IXG",
      Hubli: "HBX",
      Jamshedpur: "IXJ",
      Kanpur: "KNU",
      Nagaland: "DIM",
      Port_Blair: "IXZ",
      Visakhapatnam: "VTZ",
      Raigarh: "RIG",
      Bagdogra: "IXB",
      Jammu: "IXJ",
      Srinagar: "SXR",
      Kullu: "KUU",
      Andaman: "IXZ",
      Kolhapur: "KLH",
      Kannur: "CNN",
      Mysuru: "MYQ",
      New_Delhi: "DEL",
      Dubai: "DXB",
      Singapore: "SIN",
      Bengaluru: "BEN",
      // Add more airports as needed
    };

    return airportNames[airportCode] || airportCode;
  }

  // Get the lowest price from flight results (return '0' if no results)
  getLowestPrice(): string {
    if (this.flightResults?.length > 0) {
      return (
        Math.min(...this.flightResults.map((f) => f.price)) * this.count
      ).toString();
    } else {
      return "0";
    }
  }

  getLowestPriceValue(): number {
    if (this.flightResults?.length > 0) {
      return Math.min(...this.flightResults.map((f) => f.price));
    } else {
      return 0;
    }
  }

  getTimeFormat(value: any) {
    if (!value) return "";

    // Expecting format like "5:00 AM" or "1:45 PM"
    const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

    if (!match) return value; // fallback

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const meridian = match[3].toUpperCase();

    if (meridian === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridian === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  // Booking flight function (you can expand this logic as per your requirements)
  bookFlight(flight: any): void {
    // alert(`Flight ${flight.flightNumber} has been selected!`);
    // Additional logic to process flight booking can go here (e.g., navigating to a payment page)
    // Navigate to booking details page with the selected flight and passenger count
    this.router.navigate(["/booking-details"], {
      state: {
        flight: flight,
        count: this.count,
      },
    });
  }

  // Track by function for performance optimization in *ngFor
  trackByFn(index: number, item: any): number {
    return index; // Or return a unique identifier for the item if available
  }

  @Output() sortChanged = new EventEmitter<string>();

  isFilterOpen: boolean = false;
  sortCriteria: string = "Lowest price";

  sortOptions = [
    { value: "lowestPrice", label: "Lowest price" },
    { value: "highestPrice", label: "Highest price" },
    { value: "arrivalTime", label: "Arrival time" },
    { value: "departureTime", label: "Departure time" },
    { value: "duration", label: "Duration" },
  ];

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  selectSortOption(option: any): void {
    this.sortCriteria = option.label;
    this.sortChanged.emit(option.value);
    this.isFilterOpen = false;
    this.sortFlights(option.value); // This is passing "lowestPrice", etc.
  }

  sortFlights(criteria: string): void {
    switch (criteria) {
      case "lowestPrice":
        this.flightResults = [...this.flightResults].sort(
          (a, b) => a.price - b.price
        );
        break;
      case "highestPrice":
        this.flightResults = [...this.flightResults].sort(
          (a, b) => b.price - a.price
        );
        break;
      case "arrivalTime":
        this.flightResults = [...this.flightResults].sort((a, b) => {
          // Combine arrival timestamp and time string to create a full datetime
          const arrivalTimeA = this.combineDateAndTime(
            a.arrivalDate,
            a.arrivalTime
          );
          const arrivalTimeB = this.combineDateAndTime(
            b.arrivalDate,
            b.arrivalTime
          );
          return arrivalTimeA.getTime() - arrivalTimeB.getTime(); // Compare timestamps
        });
        break;
      case "departureTime":
        this.flightResults = [...this.flightResults].sort((a, b) => {
          // Combine departure timestamp and time string to create a full datetime
          const departureTimeA = this.combineDateAndTime(
            a.departureDate,
            a.departureTime
          );
          const departureTimeB = this.combineDateAndTime(
            b.departureDate,
            b.departureTime
          );
          return departureTimeA.getTime() - departureTimeB.getTime(); // Compare timestamps
        });
        break;
      case "duration":
        this.flightResults = [...this.flightResults].sort(
          (a, b) => a.durationMinutes - b.durationMinutes
        );
        break;
      default:
        break;
    }
  }

  // Helper method to combine date timestamp and time string
  combineDateAndTime(dateTimestamp: number, timeString: string): Date {
    const timeParts = timeString.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
    if (!timeParts) return new Date(dateTimestamp); // fallback if time string is incorrect

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const meridian = timeParts[3].toUpperCase();

    // Adjust hours based on AM/PM
    if (meridian === "PM" && hours !== 12) {
      hours += 12; // Convert PM hours to 24-hour format
    } else if (meridian === "AM" && hours === 12) {
      hours = 0; // Convert 12 AM to 00 hours
    }

    // Create a new Date object from the timestamp and adjusted time
    const newDate = new Date(dateTimestamp);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0); // Set seconds to 0 for consistency

    return newDate;
  }
}
