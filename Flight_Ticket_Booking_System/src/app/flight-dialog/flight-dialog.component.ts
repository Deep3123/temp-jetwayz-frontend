import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FlightAuthServiceService } from "../services/flight-auth-service.service";
import Swal from "sweetalert2";
import { NgForm } from "@angular/forms";

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
    private flightService: FlightAuthServiceService
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
    Swal.fire({
      icon: "info",
      title: "Operation Cancelled!",
      text: "The flight details were not updated!",
      confirmButtonText: "OK",
    });
    this.dialogRef.close();
  }

  submitForm(flightForm: NgForm): void {
    if (flightForm.invalid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input!",
        text: "Please fill in all required fields correctly.",
        confirmButtonText: "OK",
      });
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
      // console.log(date);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero
      const day = date.getDate().toString().padStart(2, "0"); // Add leading zero
      return `${year}-${month}-${day}`;
    };

    // Convert 12-hour format to 24-hour format for departure and arrival times
    const convertTo24HourFormat = (time: string): string => {
      const [timePart, period] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (period === "PM" && hours < 12) {
        hours += 12; // Convert PM times to 24-hour format
      }
      if (period === "AM" && hours === 12) {
        hours = 0; // Convert 12 AM to 00
      }
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    };

    // Extract departure date from string and combine with time
    const departureDateObject = new Date(this.selectedFlight.departureDate);
    const departureFormattedDate = formatDate(departureDateObject); // Format the date as 'yyyy-MM-dd'
    const departureTime24Hour = convertTo24HourFormat(
      this.selectedFlight.departureTime
    );
    const departureDateTimeString = `${departureFormattedDate}T${departureTime24Hour}:00`; // Combine with time in ISO format

    const departureDateTime = new Date(departureDateTimeString);
    // console.log(departureDateTimeString);
    // console.log(departureDateTime);

    // Extract arrival date from string and combine with time
    const arrivalDateObject = new Date(this.selectedFlight.arrivalDate);
    const arrivalFormattedDate = formatDate(arrivalDateObject); // Format the date as 'yyyy-MM-dd'
    const arrivalTime24Hour = convertTo24HourFormat(
      this.selectedFlight.arrivalTime
    );
    const arrivalDateTimeString = `${arrivalFormattedDate}T${arrivalTime24Hour}:00`; // Combine with time in ISO format

    const arrivalDateTime = new Date(arrivalDateTimeString);
    // console.log(arrivalDateTimeString);
    // console.log(arrivalDateTime);

    // Ensure that the dates are valid
    if (
      isNaN(departureDateTime.getTime()) ||
      isNaN(arrivalDateTime.getTime())
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date or Time!",
        text: "Please make sure both departure and arrival dates and times are valid.",
        confirmButtonText: "OK",
      });
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
          Swal.fire({
            icon: "success",
            title: "Flight Updated Successfully!",
            text: response.message,
            confirmButtonText: "OK",
          });
        },
        (error) => {
          this.isLoading = false;
          Swal.fire({
            icon: "error",
            title: "Error Updating Flight!",
            text: error.error?.message || "An unexpected error occurred.",
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      this.isLoading = true;
      this.flightService.saveFlightData(this.selectedFlight).subscribe(
        (response) => {
          this.isLoading = false;
          this.dialogRef.close(true);
          Swal.fire({
            icon: "success",
            title: "Flight Added Successfully!",
            text: response.message,
            confirmButtonText: "OK",
          });
        },
        (error) => {
          this.isLoading = false;
          Swal.fire({
            icon: "error",
            title: "Error Adding Flight!",
            text: error.error?.message || "An unexpected error occurred.",
            confirmButtonText: "OK",
          });
        }
      );
    }
  }

  calculateDuration(): void {
    // Ensure that the required fields are filled
    if (
      !this.selectedFlight.departureDate ||
      !this.selectedFlight.arrivalDate ||
      !this.selectedFlight.departureTime ||
      !this.selectedFlight.arrivalTime
    ) {
      this.selectedFlight.durationMinutes = null;
      return;
    }

    // Combine the departure date with the departure time and arrival date with arrival time
    const departureDateTimeString = `${this.selectedFlight.departureDate}T${this.selectedFlight.departureTime}`;
    const arrivalDateTimeString = `${this.selectedFlight.arrivalDate}T${this.selectedFlight.arrivalTime}`;

    // Create Date objects for both departure and arrival
    const departureDateTime = new Date(departureDateTimeString);
    const arrivalDateTime = new Date(arrivalDateTimeString);

    // Check if the date objects are valid (both should be valid Date objects)
    if (
      isNaN(departureDateTime.getTime()) ||
      isNaN(arrivalDateTime.getTime())
    ) {
      this.selectedFlight.durationMinutes = null;
      Swal.fire({
        icon: "error",
        title: "Invalid Date or Time!",
        text: "Please ensure both departure and arrival dates and times are valid.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Ensure that arrival is after departure
    if (arrivalDateTime < departureDateTime) {
      this.selectedFlight.durationMinutes = null;
      Swal.fire({
        icon: "error",
        title: "Invalid Dates!",
        text: "Arrival time cannot be earlier than departure time.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Calculate the duration in milliseconds
    const durationMs = arrivalDateTime.getTime() - departureDateTime.getTime();

    // Convert milliseconds to minutes
    const durationMinutes = Math.floor(durationMs / 60000);

    // If the duration is negative (arrival is before departure), reset to null
    this.selectedFlight.durationMinutes =
      durationMinutes >= 0 ? durationMinutes : null;

    console.log("Calculated Duration:", durationMinutes);
  }

  validateDate(event: any, type: "departure" | "arrival") {
    const selected = new Date(event.value).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    if (selected < today) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date!",
        text: `${
          type === "departure" ? "Departure" : "Arrival"
        } date cannot be in the past.`,
      });

      if (type === "departure") {
        this.selectedFlight.departureDate = null;
      } else {
        this.selectedFlight.arrivalDate = null;
      }
    }
  }
}
