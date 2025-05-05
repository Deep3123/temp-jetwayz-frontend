// import { Component, OnInit } from "@angular/core";
// import { MatDialog } from "@angular/material/dialog";
// import { FlightDialogComponent } from "../flight-dialog/flight-dialog.component";
// import { FlightAuthServiceService } from "../services/flight-auth-service.service";
// import Swal from "sweetalert2";

// declare var $: any; // Declare jQuery for DataTable initialization

// @Component({
//   selector: "app-flight-page",
//   standalone: false,
//   templateUrl: "./flight-page.component.html",
//   styleUrls: ["./flight-page.component.css"],
// })
// export class FlightPageComponent implements OnInit {
//   flights: any[] = [];
//   isLoading: any = false;

//   constructor(
//     private flightService: FlightAuthServiceService,
//     public dialog: MatDialog
//   ) {}

//   ngOnInit(): void {
//     this.getAllFlights();
//   }

//   getAllFlights() {
//     this.isLoading = true;
//     this.flightService.getAllFlights().subscribe(
//       (response: any) => {
//         this.isLoading = false;

//         // console.log(response); // Debugging
//         this.flights = response;
//         this.reinitializeDataTable(); // Ensure DataTable updates correctly
//       },
//       (error) => {
//         this.isLoading = false;
//         Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text:
//             error.message ||
//             error.error.message ||
//             "Error while fetching data!",
//           confirmButtonText: "OK",
//         });
//       }
//     );
//   }

//   openForm(): void {
//     const dialogRef = this.dialog.open(FlightDialogComponent, {
//       width: "600px",
//       data: { flight: null },
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.getAllFlights();
//     });
//   }

//   editFlight(flight: any): void {
//     const dialogRef = this.dialog.open(FlightDialogComponent, {
//       width: "600px",
//       data: { flight: flight },
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.getAllFlights();
//     });
//   }

//   deleteFlight(flight: any): void {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Proceed with the deletion if the user confirms
//         this.flightService.deleteFlight(flight.flightNumber).subscribe(
//           (response) => {
//             Swal.fire({
//               icon: "success",
//               title: "Flight Deleted!",
//               text: response.message,
//               confirmButtonText: "OK",
//             });
//             this.getAllFlights(); // Refresh the flight list
//           },
//           (error) => {
//             Swal.fire({
//               icon: "error",
//               title: "Error Deleting Flight!",
//               text: error.error.message,
//               confirmButtonText: "OK",
//             });
//           }
//         );
//       } else {
//         // Optionally, show a cancellation message if the user cancels
//         Swal.fire({
//           icon: "info",
//           title: "Deletion Cancelled",
//           text: "The flight details have not been deleted.",
//           confirmButtonText: "OK",
//         });
//       }
//     });
//   }

//   reinitializeDataTable() {
//     setTimeout(() => {
//       if ($.fn.dataTable.isDataTable("#flightTable")) {
//         $("#flightTable").DataTable().destroy();
//       }
//       $("#flightTable").DataTable({
//         destroy: true,
//         responsive: true,
//         paging: true,
//         searching: true,
//       });
//     }, 100);
//   }

//   trackByFn(index: number, flight: any) {
//     return flight.id;
//   }
// }


import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FlightDialogComponent } from "../flight-dialog/flight-dialog.component";
import { FlightAuthServiceService } from "../services/flight-auth-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-flight-page",
  standalone: false,
  templateUrl: "./flight-page.component.html",
  styleUrls: ["./flight-page.component.css"],
})
export class FlightPageComponent implements OnInit, AfterViewInit {
  flights: any[] = [];
  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);

  // Define displayed columns for the table
  displayedColumns: string[] = [
    'position',
    'flightNumber',
    'departureDate',
    'departureTime',
    'arrivalDate',
    'arrivalTime',
    'departureAirport',
    'arrivalAirport',
    'price',
    'flightClass',
    'duration',
    'seats',
    'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private flightService: FlightAuthServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllFlights();
  }

  ngAfterViewInit() {
    // Connect the sort and paginator to the data source
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllFlights() {
    this.isLoading = true;
    this.flightService.getAllFlights().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.flights = response;
        // Update the data source with new data
        this.dataSource.data = this.flights;
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.message || error.error.message || "Error while fetching data!",
          confirmButtonText: "OK",
        });
      }
    );
  }

  openForm(): void {
    const dialogRef = this.dialog.open(FlightDialogComponent, {
      width: "600px",
      data: { flight: null },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllFlights();
    });
  }

  editFlight(flight: any): void {
    const dialogRef = this.dialog.open(FlightDialogComponent, {
      width: "600px",
      data: { flight: flight },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllFlights();
    });
  }

  deleteFlight(flight: any): void {
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
        this.flightService.deleteFlight(flight.flightNumber).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire({
              icon: "success",
              title: "Flight Deleted!",
              text: response.message,
              confirmButtonText: "OK",
              confirmButtonColor: "#4F46E5",
            });
            this.getAllFlights();
          },
          (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: "error",
              title: "Error Deleting Flight!",
              text: error.error.message,
              confirmButtonText: "OK",
              confirmButtonColor: "#4F46E5",
            });
          }
        );
      }
    });
  }

  // Format duration from minutes to hours and minutes
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  // Apply filter for search functionality
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Get appropriate class chip color based on flight class
  getClassChipColor(flightClass: string): string {
    flightClass = flightClass.toLowerCase();
    if (flightClass.includes('economy')) {
      return 'economy-class';
    } else if (flightClass.includes('business')) {
      return 'business-class';
    } else if (flightClass.includes('first')) {
      return 'first-class';
    }
    return 'economy-class'; // Default
  }

  getRowNumber(i: number): number {
    if (!this.paginator) return i + 1;
    return i + 1 + this.paginator.pageIndex * this.paginator.pageSize;
  }
}