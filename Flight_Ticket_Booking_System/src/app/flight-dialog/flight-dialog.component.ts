import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FlightAuthServiceService } from "../services/flight-auth-service.service";
import Swal from "sweetalert2";
import { NgForm } from "@angular/forms";
import { isPlatformBrowser } from "@angular/common"; // Import isPlatformBrowser

@Component({
  selector: "app-flight-dialog",
  standalone: false,
  templateUrl: "./flight-dialog.component.html",
  styleUrls: ["./flight-dialog.component.css"],
})
export class FlightDialogComponent {
  isEditing = false;
  selectedFlight: any = {
    flightNumber: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    departureAirport: "",
    arrivalAirport: "",
    price: null,
    seatsAvailable: null,
    durationMinutes: null,
    airlineName: "",
    flightClass: "",
  };

  isLoading = false;

  flightClasses: string[] = ["Economy", "Business", "First Class"];

  get minDate(): Date {
    return new Date(new Date().setHours(0, 0, 0, 0));
  }

  constructor(
    public dialogRef: MatDialogRef<FlightDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private flightService: FlightAuthServiceService,
    @Inject(PLATFORM_ID) private platformId: any // Inject PLATFORM_ID
  ) {
    if (data.flight) {
      this.isEditing = true;
      // Convert existing flight airport data to lowercase
      data.flight.arrivalAirport = data.flight.arrivalAirport
        .toLowerCase()
        .trim();
      data.flight.departureAirport = data.flight.departureAirport
        .toLowerCase()
        .trim();
      this.selectedFlight = { ...data.flight };
    }
  }

  onNoClick(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Check if running in the browser
      Swal.fire({
        icon: "info",
        title: "Operation Cancelled!",
        text: "The flight details were not updated!",
        confirmButtonText: "OK",
      });
    }
    this.dialogRef.close();
  }

  submitForm(flightForm: NgForm): void {
    if (flightForm.invalid) {
      if (isPlatformBrowser(this.platformId)) {
        // Ensure SweetAlert2 only runs in the browser
        Swal.fire({
          icon: "error",
          title: "Invalid Input!",
          text: "Please fill in all required fields correctly.",
          confirmButtonText: "OK",
        });
      }
      return;
    }

    // Convert airport names to lowercase before submission
    this.selectedFlight.departureAirport = this.selectedFlight.departureAirport
      .toLowerCase()
      .trim();
    this.selectedFlight.arrivalAirport = this.selectedFlight.arrivalAirport
      .toLowerCase()
      .trim();

    // Function to extract date in 'yyyy-MM-dd' format
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Convert 12-hour format to 24-hour format for departure and arrival times
    const convertTo24HourFormat = (time: string): string => {
      const [timePart, period] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (period === "PM" && hours < 12) {
        hours += 12;
      }
      if (period === "AM" && hours === 12) {
        hours = 0;
      }
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    };

    // Extract departure date from string and combine with time
    const departureDateObject = new Date(this.selectedFlight.departureDate);
    const departureFormattedDate = formatDate(departureDateObject);
    const departureTime24Hour = convertTo24HourFormat(
      this.selectedFlight.departureTime
    );
    const departureDateTimeString = `${departureFormattedDate}T${departureTime24Hour}:00`;

    const departureDateTime = new Date(departureDateTimeString);

    // Extract arrival date from string and combine with time
    const arrivalDateObject = new Date(this.selectedFlight.arrivalDate);
    const arrivalFormattedDate = formatDate(arrivalDateObject);
    const arrivalTime24Hour = convertTo24HourFormat(
      this.selectedFlight.arrivalTime
    );
    const arrivalDateTimeString = `${arrivalFormattedDate}T${arrivalTime24Hour}:00`;

    const arrivalDateTime = new Date(arrivalDateTimeString);

    // Ensure that the dates are valid
    if (
      isNaN(departureDateTime.getTime()) ||
      isNaN(arrivalDateTime.getTime())
    ) {
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Date or Time!",
          text: "Please make sure both departure and arrival dates and times are valid.",
          confirmButtonText: "OK",
        });
      }
      return;
    }

    // Assign the combined date and time to the selectedFlight object
    this.selectedFlight.departureDate = departureDateTime;
    this.selectedFlight.arrivalDate = arrivalDateTime;

    // Now send the combined date-time objects to the backend
    if (this.isEditing) {
      this.isLoading = true;
      this.flightService.updateFlight(this.selectedFlight).subscribe(
        (response) => {
          this.isLoading = false;
          this.dialogRef.close(true);
          if (isPlatformBrowser(this.platformId)) {
            Swal.fire({
              icon: "success",
              title: "Flight Updated Successfully!",
              text: response.message,
              confirmButtonText: "OK",
            });
          }
        },
        (error) => {
          this.isLoading = false;
          if (isPlatformBrowser(this.platformId)) {
            Swal.fire({
              icon: "error",
              title: "Error Updating Flight!",
              text: error.error?.message || "An unexpected error occurred.",
              confirmButtonText: "OK",
            });
          }
        }
      );
    } else {
      this.isLoading = true;
      this.flightService.saveFlightData(this.selectedFlight).subscribe(
        (response) => {
          this.isLoading = false;
          this.dialogRef.close(true);
          if (isPlatformBrowser(this.platformId)) {
            Swal.fire({
              icon: "success",
              title: "Flight Added Successfully!",
              text: response.message,
              confirmButtonText: "OK",
            });
          }
        },
        (error) => {
          this.isLoading = false;
          if (isPlatformBrowser(this.platformId)) {
            Swal.fire({
              icon: "error",
              title: "Error Adding Flight!",
              text: error.error?.message || "An unexpected error occurred.",
              confirmButtonText: "OK",
            });
          }
        }
      );
    }
  }

  calculateDuration(): void {
    if (
      !this.selectedFlight.departureDate ||
      !this.selectedFlight.arrivalDate ||
      !this.selectedFlight.departureTime ||
      !this.selectedFlight.arrivalTime
    ) {
      this.selectedFlight.durationMinutes = null;
      return;
    }

    const departureDateTimeString = `${this.selectedFlight.departureDate}T${this.selectedFlight.departureTime}`;
    const arrivalDateTimeString = `${this.selectedFlight.arrivalDate}T${this.selectedFlight.arrivalTime}`;

    const departureDateTime = new Date(departureDateTimeString);
    const arrivalDateTime = new Date(arrivalDateTimeString);

    if (
      isNaN(departureDateTime.getTime()) ||
      isNaN(arrivalDateTime.getTime())
    ) {
      this.selectedFlight.durationMinutes = null;
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Date or Time!",
          text: "Please ensure both departure and arrival dates and times are valid.",
          confirmButtonText: "OK",
        });
      }
      return;
    }

    if (arrivalDateTime < departureDateTime) {
      this.selectedFlight.durationMinutes = null;
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Dates!",
          text: "Arrival time cannot be earlier than departure time.",
          confirmButtonText: "OK",
        });
      }
      return;
    }

    const durationMs = arrivalDateTime.getTime() - departureDateTime.getTime();
    const durationMinutes = Math.floor(durationMs / 60000);

    this.selectedFlight.durationMinutes =
      durationMinutes >= 0 ? durationMinutes : null;

    console.log("Calculated Duration:", durationMinutes);
  }

  validateDate(event: any, type: "departure" | "arrival") {
    const selected = new Date(event.value).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    if (selected < today) {
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Date!",
          text: `${
            type === "departure" ? "Departure" : "Arrival"
          } date cannot be in the past.`,
        });
      }

      if (type === "departure") {
        this.selectedFlight.departureDate = null;
      } else {
        this.selectedFlight.arrivalDate = null;
      }
    }
  }
}
