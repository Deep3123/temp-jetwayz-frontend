// import { Component, OnInit } from "@angular/core";
// import { MatDialog } from "@angular/material/dialog";
// import { ContactUsDialogComponent } from "../contact-us-dialog/contact-us-dialog.component"; // Import dialog component
// import Swal from "sweetalert2";
// import { ContactServiceService } from "../services/contact-service.service";

// declare var $: any; // Declare jQuery for DataTable initialization

// @Component({
//   selector: "app-contact-us-page",
//   standalone: false,
//   templateUrl: "./contact-us-page.component.html",
//   styleUrls: ["./contact-us-page.component.css"],
// })
// export class ContactUsPageComponent implements OnInit {
//   contacts: any[] = [];
//   isLoading: any = false;

//   constructor(
//     private contactService: ContactServiceService, // Contact service
//     public dialog: MatDialog
//   ) { }

//   ngOnInit(): void {
//     this.getAllContacts();
//   }

//   // Fetch all contact queries from the backend
//   getAllContacts() {
//     this.isLoading = true
//     this.contactService.getAllContactData().subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         this.contacts = response;
//         this.reinitializeDataTable(); // Reinitialize DataTable
//       },
//       (error) => {
//         Swal.fire({
//           icon: "error",
//           title: "Error Fetching Data",
//           text: "There was an issue fetching contact queries.",
//           confirmButtonText: "OK",
//         });
//       }
//     );
//   }

//   // Open dialog with full details of the contact query
//   viewContact(contact: any): void {
//     const dialogRef = this.dialog.open(ContactUsDialogComponent, {
//       width: "600px",
//       data: { contact: contact },
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       // Swal.fire({
//       //   icon: "info",
//       //   title: "Closed View",
//       //   text: "You have closed the contact query details.",
//       //   confirmButtonText: "OK",
//       // });
//       // Optionally, you can refresh the list of contacts
//       this.getAllContacts();
//     });
//   }

//   // Delete contact query with confirmation
//   deleteContact(contact: any): void {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this deletion!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Call the delete API from service
//         this.contactService.deleteContact(contact).subscribe(
//           (response) => {
//             Swal.fire({
//               icon: "success",
//               title: "Deleted Successfully!",
//               text: "The contact query has been deleted.",
//               confirmButtonText: "OK",
//             });
//             // Refresh the contact list
//             this.getAllContacts();
//           },
//           (error) => {
//             Swal.fire({
//               icon: "error",
//               title: "Error Deleting Query",
//               text: "There was an issue deleting the contact query.",
//               confirmButtonText: "OK",
//             });
//           }
//         );
//       }
//       else {
//         Swal.fire({
//           icon: "info",
//           title: "Deletion Cancelled",
//           text: "The contact query was not deleted.",
//           confirmButtonText: "OK",
//         });
//       }
//     });
//   }

//   // Reinitialize DataTable with new data
//   reinitializeDataTable() {
//     setTimeout(() => {
//       if ($.fn.dataTable.isDataTable("#contactUsTable")) {
//         $("#contactUsTable").DataTable().destroy();
//       }
//       $("#contactUsTable").DataTable({
//         destroy: true,
//         responsive: true,
//         paging: true,
//         searching: true,
//       });
//     }, 100);
//   }

//   trackByFn(index: number, contact: any) {
//     return contact.id;
//   }
// }

import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ContactUsDialogComponent } from "../contact-us-dialog/contact-us-dialog.component";
import { ContactServiceService } from "../services/contact-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-contact-us-page",
  standalone: false,
  templateUrl: "./contact-us-page.component.html",
  styleUrls: ["./contact-us-page.component.css"],
})
export class ContactUsPageComponent implements OnInit, AfterViewInit {
  contacts: any[] = [];
  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);

  // Define displayed columns for the table
  displayedColumns: string[] = [
    'position',
    'name',
    'email',
    'phone',
    'message',
    'submittedAt',
    'view',
    'delete'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private contactService: ContactServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllContacts();
  }

  ngAfterViewInit() {
    // Connect the sort and paginator to the data source
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllContacts() {
    this.isLoading = true;
    this.contactService.getAllContactData().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.contacts = response;
        // Update the data source with new data
        this.dataSource.data = this.contacts;
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

  // Open dialog with full details of the contact query
  viewContact(contact: any): void {
    const dialogRef = this.dialog.open(ContactUsDialogComponent, {
      width: "600px",
      data: { contact: contact },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllContacts();
    });
  }

  // Delete contact query with confirmation
  deleteContact(contact: any): void {
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
        this.contactService.deleteContact(contact).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire({
              icon: "success",
              title: "Contact Deleted!",
              text: "The contact query has been deleted successfully.",
              confirmButtonText: "OK",
              confirmButtonColor: "#4F46E5",
            });
            this.getAllContacts();
          },
          (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: "error",
              title: "Error Deleting Contact!",
              text: error.error?.message || "Failed to delete contact query.",
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
  trackByFn(index: number, contact: any) {
    return contact.id;
  }

  getRowNumber(i: number): number {
    if (!this.paginator) return i + 1;
    return i + 1 + this.paginator.pageIndex * this.paginator.pageSize;
  }
}