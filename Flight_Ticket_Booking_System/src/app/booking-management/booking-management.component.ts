// import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import Swal from 'sweetalert2';
// import { BookingDetailsDialogComponent } from '../booking-details-dialog/booking-details-dialog.component';
// import { BookingServiceService } from '../services/booking-service.service';

// declare var $: any;

// @Component({
//   selector: 'app-booking-management',
//   standalone: false,
//   templateUrl: './booking-management.component.html',
//   styleUrls: ['./booking-management.component.css']
// })
// export class BookingManagementComponent implements OnInit {
//   bookings: any[] = [];

//   isLoading: boolean = false;

//   constructor(private bookingService: BookingServiceService, public dialog: MatDialog) { }

//   ngOnInit(): void {
//     this.getAllBookings();
//   }

//   getAllBookings() {
//     this.isLoading = true;
//     this.bookingService.getAllBookings().subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         this.bookings = response;
//         this.reinitializeDataTable();
//       },
//       (error) => {
//         this.isLoading = false;
//         Swal.fire({
//           icon: 'error',
//           title: 'Error Fetching Bookings',
//           text: 'There was a problem loading bookings data.',
//           confirmButtonText: 'OK'
//         });
//       }
//     );
//   }

//   viewBookingDetails(booking: any): void {
//     const dialogRef = this.dialog.open(BookingDetailsDialogComponent, {
//       width: '600px',
//       data: { booking: booking }
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.getAllBookings();
//     });
//   }

//   deleteBookingDetails(booking: any): void {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this deletion!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.isLoading = true;

//         this.bookingService.deleteBooking(booking.paymentId).subscribe(
//           (response) => {
//             this.isLoading = false;
//             Swal.fire({
//               icon: "success",
//               title: "Deleted Successfully!",
//               text: response.message,
//               confirmButtonText: "OK",
//             });
//             this.getAllBookings();
//           },
//           (error) => {
//             this.isLoading = false;
//             Swal.fire({
//               icon: "error",
//               title: "Error Deleting Booking",
//               text: error.message || error.error.message || "There was an issue deleting the booking.",
//               confirmButtonText: "OK",
//             });
//           }
//         );
//       } else {
//         Swal.fire({
//           icon: "info",
//           title: "Deletion Cancelled",
//           text: "The booking was not deleted.",
//           confirmButtonText: "OK",
//         });
//       }
//     });
//   }

//   // reinitializeDataTable(): void {
//   //   setTimeout(() => {
//   //     const table = $('#bookingTable');
//   //     if ($.fn.DataTable.isDataTable(table)) {
//   //       table.DataTable().clear().destroy();
//   //     }

//   //     table.DataTable({
//   //       responsive: true,
//   //       paging: true,
//   //       searching: true,
//   //       ordering: true,
//   //       columnDefs: [
//   //         { orderable: false, targets: -1 } // Disable sorting for the "Actions" column
//   //       ]
//   //     });
//   //   }, 0); // Set timeout to 0 to execute after DOM update
//   // }

//   reinitializeDataTable() {
//     setTimeout(() => {
//       if ($.fn.dataTable.isDataTable("#bookingTable")) {
//         $("#bookingTable").DataTable().destroy();
//       }
//       $("#bookingTable").DataTable({
//         destroy: true,
//         responsive: true,
//         paging: true,
//         searching: true,
//       });
//     }, 100);
//   }

//   trackByFn(index: number, booking: any) {
//     return booking.id;
//   }
// }

import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BookingDetailsDialogComponent } from "../booking-details-dialog/booking-details-dialog.component";
import { BookingServiceService } from "../services/booking-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-booking-management",
  standalone: false,
  templateUrl: "./booking-management.component.html",
  styleUrls: ["./booking-management.component.css"],
})
export class BookingManagementComponent implements OnInit, AfterViewInit {
  bookings: any[] = [];
  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 10; // Default page size
  pageIndex = 0; // Current page index

  // Define displayed columns for the table
  displayedColumns: string[] = [
    "position",
    "flightId",
    "amount",
    "bookingDate",
    "count",
    "name",
    "email",
    "phone",
    "view",
    "delete",
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookingService: BookingServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllBookings();
  }

  ngAfterViewInit() {
    // Connect the sort and paginator to the data source
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Add listener for page changes to update row numbers
    this.paginator.page.subscribe((pageEvent: PageEvent) => {
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    });
  }

  getAllBookings() {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.bookings = response;
        // Update the data source with new data
        this.dataSource.data = this.bookings;
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: "error",
          title: "Error Fetching Bookings",
          text:
            error.message ||
            error.error?.message ||
            "There was a problem loading bookings data.",
          confirmButtonText: "OK",
          confirmButtonColor: "#4F46E5",
        });
      }
    );
  }

  // Method to calculate the row number (continuous across pages)
  getRowNumber(index: number): number {
    return this.pageIndex * this.pageSize + index + 1;
  }

  // Open dialog with full details of the booking
  viewBookingDetails(booking: any): void {
    const dialogRef = this.dialog.open(BookingDetailsDialogComponent, {
      width: "600px",
      data: { booking: booking },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllBookings();
    });
  }

  // Delete booking with confirmation
  deleteBookingDetails(booking: any): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.bookingService.deleteBooking(booking.paymentId).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire({
              icon: "success",
              title: "Booking Deleted!",
              text: "The booking has been deleted successfully.",
              confirmButtonText: "OK",
              confirmButtonColor: "#4F46E5",
            });
            this.getAllBookings();
          },
          (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: "error",
              title: "Error Deleting Booking!",
              text: error.error?.message || "Failed to delete booking.",
              confirmButtonText: "OK",
              confirmButtonColor: "#4F46E5",
            });
          }
        );
      }
    });
  }

  // Apply filter for search functionality
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Track function for ngFor performance optimization
  trackByFn(index: number, booking: any) {
    return booking.id;
  }
}