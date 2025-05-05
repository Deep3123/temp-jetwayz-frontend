import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-details-dialog',
  standalone: false,
  templateUrl: './booking-details-dialog.component.html',
  styleUrl: './booking-details-dialog.component.css'
})
export class BookingDetailsDialogComponent {
  booking: any;

  constructor(
    public dialogRef: MatDialogRef<BookingDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.booking = data.booking;
  }

  onClose(): void {
    Swal.fire({
      icon: 'info',
      title: 'Dialog Closed',
      text: 'You have closed the booking details view.',
      confirmButtonText: 'OK'
    });
    this.dialogRef.close();
  }
}
