import { Component, HostListener } from "@angular/core";
import { FlightAuthServiceService } from "../services/flight-auth-service.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-flight-booking",
  standalone: false,
  templateUrl: "./flight-booking.component.html",
  styleUrls: ["./flight-booking.component.css"],
})
export class FlightBookingComponent {
  adultCount: number = 1;
  childCount: number = 0;
  infantCount: number = 0;
  showCounter: boolean = false;

  selectedClass: string = "Economy";
  showClassDropdown: boolean = false;

  departureAirport: string = "";
  arrivalAirport: string = "";
  departureTime: any = "";
  arrivalTime: any = "";

  isLoading: any = false;

  constructor(
    private service: FlightAuthServiceService,
    private router: Router
  ) {}

  get passengerCount(): number {
    return this.adultCount + this.childCount + this.infantCount;
  }

  get passengerCountText(): string {
    return `${this.passengerCount} Passenger${
      this.passengerCount > 1 ? "s" : ""
    }`;
  }

  toggleCounter(event?: Event): void {
    event?.stopPropagation();
    this.showCounter = !this.showCounter;
    this.showClassDropdown = false;
  }

  toggleClassDropdown(event?: Event): void {
    event?.stopPropagation();
    this.showClassDropdown = !this.showClassDropdown;
    this.showCounter = false;
  }

  increment(type: "adult" | "child" | "infant"): void {
    if (this.passengerCount >= 9) return;

    if (type === "adult") this.adultCount++;
    if (type === "child") this.childCount++;
    if (type === "infant") this.infantCount++;
  }

  decrement(type: "adult" | "child" | "infant"): void {
    if (type === "adult" && this.adultCount > 1) this.adultCount--;
    if (type === "child" && this.childCount > 0) this.childCount--;
    if (type === "infant" && this.infantCount > 0) this.infantCount--;
  }

  selectClass(classType: string): void {
    this.selectedClass = classType;
    this.showClassDropdown = false;
  }

  formatDateTime(date: Date): string {
    if (date != null) {
      const pad = (n: number) => n.toString().padStart(2, "0");

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());

      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

      const timezoneOffset = -date.getTimezoneOffset();
      const sign = timezoneOffset >= 0 ? "+" : "-";
      const timezoneHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
      const timezoneMinutes = pad(Math.abs(timezoneOffset) % 60);

      // Format to Java-compatible format: yyyy-MM-dd'T'HH:mm:ss.SSSZ
      // return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${timezoneHours}${timezoneMinutes}`;
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    throw new Error("Invalid date");
  }

  onSubmit() {
    const flight = {
      departureAirport: this.departureAirport.toLowerCase().trim(),
      arrivalAirport: this.arrivalAirport.toLowerCase().trim(),
      departureDate: this.formatDateTime(this.departureTime),
      arrivalDate: this.formatDateTime(this.arrivalTime),
      personCount: this.passengerCount,
      flightClass: this.selectedClass,
    };

    // console.log(flight);
    console.log("Departure:", this.departureTime, "Arrival:", this.arrivalTime);

    this.isLoading = true;
    this.service.getFlightByAllDetails(flight).subscribe(
      (response) => {
        this.isLoading = false;
        // Success popup
        Swal.fire({
          icon: "success",
          title: "Flights Loaded Successfully ✈️",
          text:
            response.message ||
            "We found matching flights based on your search criteria.",
          confirmButtonText: "View Results",
        }).then(() => {
          // console.log("Flight search response:", response);
          // You can add logic here to show or navigate to the results
          this.router.navigate(["/flight-result"], {
            state: { flights: response, count: this.passengerCount }, // Pass count directly
          });
        });
      },
      (error) => {
        // Error popup
        let errorMessage =
          "We couldn't find any flights matching your search. Please try different dates or locations.";

        if (error.error && error.error.message) {
          errorMessage = error.error.message; // Custom message from backend
        }

        this.isLoading = false;
        Swal.fire({
          icon: "error",
          title: "No Flights Found 😔",
          text: errorMessage,
          confirmButtonText: "Try Again",
        });
      }
    );
  }

  get minDate(): Date {
    return new Date(new Date().setHours(0, 0, 0, 0));
  }

  validateDate(event: any, type: "departure" | "arrival") {
    const selectedRaw = new Date(event.value); // Raw selected date
    const today = new Date(); // Today's date for comparison

    // Strip both dates to compare day-wise only
    const selectedDateOnly = new Date(
      selectedRaw.setHours(0, 0, 0, 0)
    ).getTime();
    const todayDateOnly = new Date(today.setHours(0, 0, 0, 0)).getTime();

    if (selectedDateOnly < todayDateOnly) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date!",
        text: `${
          type === "departure" ? "Departure" : "Arrival"
        } date cannot be in the past.`,
      });

      // Reset the selected date if it's invalid
      if (type === "departure") {
        this.departureTime = null;
      } else {
        this.arrivalTime = null;
      }
      return;
    }

    // If selected date is today, append current time
    if (selectedDateOnly === todayDateOnly) {
      const now = new Date();
      selectedRaw.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );
    } else {
      // If it's not today, we set the time to midnight (00:00)
      selectedRaw.setHours(0, 0, 0, 0);
    }

    // Assign the updated date (with current time if today) to the respective field
    if (type === "departure") {
      this.departureTime = selectedRaw;
    } else {
      this.arrivalTime = selectedRaw;
    }

    // If selected date is today, append current time
    // let finalDate: Date;
    // if (selectedDateOnly === todayDateOnly) {
    //   const now = new Date();
    //   finalDate = new Date(
    //     selectedRaw.getFullYear(),
    //     selectedRaw.getMonth(),
    //     selectedRaw.getDate(),
    //     now.getHours(),
    //     now.getMinutes(),
    //     now.getSeconds()
    //   );
    // } else {
    //   // Future date, set time to 00:00 (or leave as is)
    //   finalDate = new Date(
    //     selectedRaw.getFullYear(),
    //     selectedRaw.getMonth(),
    //     selectedRaw.getDate()
    //   );
    // }

    // // Assign updated date to model
    // if (type === 'departure') {
    //   this.departureTime = finalDate;
    // } else {
    //   this.arrivalTime = finalDate;
    // }
  }

  @HostListener("document:click", ["$event"])
  handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isPassenger =
      target.closest(".passenger-group") ||
      target.closest(".passenger-counter");
    const isClass =
      target.closest(".class-group") || target.closest(".class-dropdown");

    if (!isPassenger) this.showCounter = false;
    if (!isClass) this.showClassDropdown = false;
  }
}
