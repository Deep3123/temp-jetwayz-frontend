import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { isPlatformBrowser } from "@angular/common"; // Import this to check the platform

@Component({
  selector: "app-booking-details-dialog",
  standalone: false,
  templateUrl: "./booking-details-dialog.component.html",
  styleUrls: ["./booking-details-dialog.component.css"],
})
export class BookingDetailsDialogComponent {
  booking: any;

  constructor(
    public dialogRef: MatDialogRef<BookingDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private platformId: Object // Inject platformId to check the platform
  ) {
    this.booking = data.booking;
  }

  onClose(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Check if it's running in the browser
      Swal.fire({
        icon: "info",
        title: "Dialog Closed",
        text: "You have closed the booking details view.",
        confirmButtonText: "OK",
      }).then(() => {
        this.dialogRef.close();
      });
    } else {
      this.dialogRef.close(); // If it's not the browser, just close the dialog
    }
  }
}
