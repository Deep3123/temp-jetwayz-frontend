// // admin-page.component.ts
// import { Component, OnInit, AfterViewInit } from "@angular/core";
// import { MatDialog } from "@angular/material/dialog";
// import { UserDialogComponent } from "../user-dialog/user-dialog.component";
// import { UserAuthServiceService } from "../services/user-auth-service.service";
// import Swal from "sweetalert2";

// declare var $: any; // Declare jQuery for DataTable initialization

// @Component({
//   selector: "app-admin-page",
//   standalone: false,
//   templateUrl: "./admin-page.component.html",
//   styleUrls: ["./admin-page.component.css"],
// })
// export class AdminPageComponent implements OnInit {
//   users: any[] = [];
//   isLoading: any = false;

//   constructor(
//     private userService: UserAuthServiceService,
//     public dialog: MatDialog
//   ) {}

//   ngOnInit(): void {
//     this.getAllUsers();
//   }

//   getAllUsers() {
//     this.isLoading = true;
//     this.userService.getAllUsers().subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         // console.log(response); // Debugging
//         this.users = response;
//         this.reinitializeDataTable(); // Ensure DataTable updates correctly
//       },
//       (error) => {
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
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: "600px",
//       data: { user: null },
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.getAllUsers();
//     });
//   }

//   editUser(user: any): void {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: "600px",
//       data: { user: user },
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.getAllUsers();
//     });
//   }

//   deleteUser(user: any): void {
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
//         this.userService.deleteUser(user.username).subscribe(
//           (response) => {
//             Swal.fire({
//               icon: "success",
//               title: "Deletion Successful!",
//               text: response.message,
//               confirmButtonText: "OK",
//             });
//             this.getAllUsers(); // Refresh the user list
//           },
//           (error) => {
//             Swal.fire({
//               icon: "error",
//               title: "Error Deleting User!",
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
//           text: "The user details have not been deleted.",
//           confirmButtonText: "OK",
//         });
//       }
//     });
//   }

//   reinitializeDataTable() {
//     setTimeout(() => {
//       if ($.fn.dataTable.isDataTable("#userTable")) {
//         $("#userTable").DataTable().destroy();
//       }
//       $("#userTable").DataTable({
//         destroy: true,
//         responsive: true,
//         paging: true,
//         searching: true,
//       });
//     }, 100);
//   }

//   trackByFn(index: number, user: any) {
//     return user.id;
//   }
// }

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-page',
  standalone: false,
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit, AfterViewInit {
  users: any[] = [];
  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);
  private destroy$ = new Subject<void>();

  // Column definitions
  displayedColumns: string[] = [
    'position',
    'name',
    'email',
    'username',
    'phone',
    'role',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserAuthServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngAfterViewInit() {
    // Connect the sort and paginator to the data source
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Filter function for the search box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.users = response;
        // Update the data source with new data
        this.dataSource.data = this.users;
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: error.status,
          text: error.message || error.error?.message || 'Error while fetching data!',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Get the actual row number
  getRowNumber(i: number): number {
    if (!this.paginator) return i + 1;
    return i + 1 + this.paginator.pageIndex * this.paginator.pageSize;
  }

  openForm(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: { user: null }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.getAllUsers();
      }
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: { user: user }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.getAllUsers();
      }
    });
  }

  deleteUser(user: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.userService.deleteUser(user.username).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (response) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: response.message || 'User has been deleted.',
              confirmButtonText: 'OK'
            });
            this.getAllUsers();
          },
          error: (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: error.status,
              text: error.error?.message || 'Error deleting user!',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  // Track function for ngFor performance optimization
  trackByFn(index: number, user: any) {
    return user.id || user.username;
  }
}

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { UserDialogComponent } from '../user-dialog/user-dialog.component';
// import { UserAuthServiceService } from '../services/user-auth-service.service';
// import Swal from 'sweetalert2';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { FormControl, FormGroup } from '@angular/forms';

// @Component({
//   selector: 'app-admin-page',
//   standalone: false,
//   templateUrl: './admin-page.component.html',
//   styleUrls: ['./admin-page.component.css']
// })
// export class AdminPageComponent implements OnInit, OnDestroy {
//   // Table data and pagination controls
//   users: any[] = [];
//   isLoading = false;
//   totalItems = 0;
//   totalPages = 0;
//   currentPage = 0;
//   pageSize = 10;
//   pageSizeOptions = [5, 10, 25, 50, 100];
//   sortField = 'createdAt';
//   sortDirection = 'desc';
//   searchQuery = '';

//   // Column definitions
//   displayedColumns: string[] = [
//     'position',
//     'name',
//     'email',
//     'username',
//     'phone',
//     'role',
//     'createdAt',
//     'updatedAt',
//     'actions'
//   ];

//   // Subject for handling unsubscribe pattern
//   private destroy$ = new Subject<void>();

//   // Form for managing pagination
//   paginationForm = new FormGroup({
//     pageSize: new FormControl(this.pageSize)
//   });

//   constructor(
//     private userService: UserAuthServiceService,
//     public dialog: MatDialog
//   ) { }

//   ngOnInit(): void {
//     this.loadUsers();

//     // Subscribe to page size changes
//     this.paginationForm.get('pageSize')?.valueChanges
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(value => {
//         if (value !== null) {
//           this.pageSize = value;
//           this.currentPage = 0; // Reset to first page when changing page size
//           this.loadUsers();
//         }
//       });
//   }

//   ngOnDestroy() {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   // Main function to load users with pagination
//   loadUsers(): void {
//     this.isLoading = true;

//     this.userService.getUsersPaginated(
//       this.currentPage,
//       this.pageSize,
//       this.sortField,
//       this.sortDirection,
//       this.searchQuery
//     )
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: any) => {
//           this.isLoading = false;
//           this.users = response.users;
//           this.totalItems = response.totalItems;
//           this.totalPages = response.totalPages;
//           this.currentPage = response.currentPage;
//         },
//         error: (error) => {
//           this.isLoading = false;
//           this.handleError(error, 'Error while fetching users');
//         }
//       });
//   }

//   // Function to apply search filter
//   applySearchFilter(event: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.searchQuery = filterValue.trim().toLowerCase();
//     this.currentPage = 0; // Reset to first page when filtering
//     this.loadUsers();
//   }

//   // Function to clear search filter
//   clearSearchFilter(): void {
//     this.searchQuery = '';
//     this.currentPage = 0;
//     this.loadUsers();
//   }

//   // Function to change page
//   changePage(page: number): void {
//     if (page >= 0 && page < this.totalPages) {
//       this.currentPage = page;
//       this.loadUsers();
//     }
//   }

//   // Function to handle sort order changes
//   changeSort(field: string): void {
//     if (this.sortField === field) {
//       // Toggle sort direction if clicking the same field
//       this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//     } else {
//       // Default to ascending for new sort field
//       this.sortField = field;
//       this.sortDirection = 'asc';
//     }
//     this.currentPage = 0; // Reset to first page when changing sort
//     this.loadUsers();
//   }

//   // Determine row number based on pagination
//   getRowNumber(index: number): number {
//     return (this.currentPage * this.pageSize) + index + 1;
//   }

//   // Function to create pagination array for template
//   getPaginationRange(): number[] {
//     const totalPages = this.totalPages;
//     const currentPage = this.currentPage;

//     // For small number of pages, show all pages
//     if (totalPages <= 7) {
//       return Array.from({ length: totalPages }, (_, i) => i);
//     }

//     // For large number of pages, create a smart pagination range
//     const pages: number[] = [];

//     // Always include first page
//     pages.push(0);

//     // Calculate middle range
//     if (currentPage <= 3) {
//       // Near start, show 0, 1, 2, 3, 4, ..., last
//       for (let i = 1; i <= 4; i++) {
//         pages.push(i);
//       }
//     } else if (currentPage >= totalPages - 4) {
//       // Near end, show 0, ..., last-4, last-3, last-2, last-1, last
//       for (let i = totalPages - 5; i < totalPages - 1; i++) {
//         pages.push(i);
//       }
//     } else {
//       // In middle, show 0, ..., current-1, current, current+1, ..., last
//       pages.push(-1); // Ellipsis placeholder
//       for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//         pages.push(i);
//       }
//     }

//     // Add ellipsis if not near end
//     if (currentPage < totalPages - 4) {
//       pages.push(-1); // Ellipsis placeholder
//     }

//     // Always include last page
//     if (totalPages > 1) {
//       pages.push(totalPages - 1);
//     }

//     return pages;
//   }

//   // Open dialog for creating a new user
//   openForm(): void {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: '600px',
//       data: { user: null }
//     });

//     dialogRef.afterClosed()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(result => {
//         if (result) {
//           this.loadUsers();
//         }
//       });
//   }

//   // Open dialog for editing a user
//   editUser(user: any): void {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: '600px',
//       data: { user: user }
//     });

//     dialogRef.afterClosed()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(result => {
//         if (result) {
//           this.loadUsers();
//         }
//       });
//   }

//   // Delete a user
//   deleteUser(user: any): void {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6B7280",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.isLoading = true;
//         this.userService.deleteUser(user.username)
//           .pipe(takeUntil(this.destroy$))
//           .subscribe({
//             next: (response) => {
//               this.isLoading = false;
//               Swal.fire({
//                 icon: 'success',
//                 title: 'Deleted!',
//                 text: response.message || 'User has been deleted.',
//                 confirmButtonText: 'OK'
//               });
//               this.loadUsers();
//             },
//             error: (error) => {
//               this.isLoading = false;
//               this.handleError(error, 'Error deleting user');
//             }
//           });
//       }
//     });
//   }

//   // Helper function to handle errors
//   private handleError(error: any, defaultMessage: string): void {
//     Swal.fire({
//       icon: 'error',
//       title: error.status || 'Error',
//       text: error.error?.message || error.message || defaultMessage,
//       confirmButtonText: 'OK'
//     });
//   }

//   // Track function for ngFor performance optimization
//   trackByFn(index: number, user: any) {
//     return user.id || user.username;
//   }
// }

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { UserDialogComponent } from '../user-dialog/user-dialog.component';
// import { UserAuthServiceService } from '../services/user-auth-service.service';
// import Swal from 'sweetalert2';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

// @Component({
//   selector: 'app-admin-page',
//   standalone: false,
//   templateUrl: './admin-page.component.html',
//   styleUrls: ['./admin-page.component.css']
// })
// export class AdminPageComponent implements OnInit, OnDestroy {
//   users: any[] = [];
//   isLoading = false;
//   currentPage = 0;
//   pageSize = 10;
//   totalUsers = 0;
//   totalPages = 0;
//   sortColumn = '';
//   sortDirection: 'asc' | 'desc' = 'asc';
//   searchTerm = '';

//   private destroy$ = new Subject<void>();

//   constructor(
//     private userService: UserAuthServiceService,
//     public dialog: MatDialog
//   ) { }

//   ngOnInit(): void {
//     this.fetchUsers();
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   fetchUsers(): void {
//     this.isLoading = true;
//     this.userService.getUsersPaginated({
//       page: this.currentPage,
//       size: this.pageSize,
//       sortBy: this.sortColumn,
//       sortDir: this.sortDirection,
//       search: this.searchTerm
//     }).pipe(
//       takeUntil(this.destroy$)
//     ).subscribe({
//       next: (res: any) => {
//         this.isLoading = false;
//         this.users = res.content;
//         this.totalUsers = res.totalElements;
//         this.totalPages = res.totalPages;
//       },
//       error: (err) => {
//         this.isLoading = false;
//         Swal.fire({
//           icon: 'error',
//           title: 'Error fetching users',
//           text: err.message || 'Something went wrong!'
//         });
//       }
//     });
//   }

//   onSearchChange(value: string): void {
//     this.searchTerm = value.trim();
//     this.currentPage = 0;
//     this.fetchUsers();
//   }

//   changePage(page: number): void {
//     if (page >= 0 && page < this.totalPages) {
//       this.currentPage = page;
//       this.fetchUsers();
//     }
//   }

//   setSort(column: string): void {
//     if (this.sortColumn === column) {
//       this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//     } else {
//       this.sortColumn = column;
//       this.sortDirection = 'asc';
//     }
//     this.fetchUsers();
//   }

//   getSortIcon(column: string): string {
//     if (this.sortColumn !== column) return '';
//     return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
//   }

//   openForm(): void {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: '600px',
//       data: { user: null }
//     });

//     dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
//       if (result) this.fetchUsers();
//     });
//   }

//   editUser(user: any): void {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: '600px',
//       data: { user }
//     });

//     dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
//       if (result) this.fetchUsers();
//     });
//   }

//   deleteUser(user: any): void {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6B7280",
//     }).then(result => {
//       if (result.isConfirmed) {
//         this.isLoading = true;
//         this.userService.deleteUser(user.username).pipe(
//           takeUntil(this.destroy$)
//         ).subscribe({
//           next: (res) => {
//             this.isLoading = false;
//             Swal.fire('Deleted!', res.message || 'User has been deleted.', 'success');
//             this.fetchUsers();
//           },
//           error: (err) => {
//             this.isLoading = false;
//             Swal.fire('Error!', err.message || 'Could not delete user.', 'error');
//           }
//         });
//       }
//     });
//   }
// }


// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { UserDialogComponent } from '../user-dialog/user-dialog.component';
// import { UserAuthServiceService } from '../services/user-auth-service.service';
// import Swal from 'sweetalert2';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

// @Component({
//   selector: 'app-admin-page',
//   standalone: false,
//   templateUrl: './admin-page.component.html',
//   styleUrls: ['./admin-page.component.css']
// })
// export class AdminPageComponent implements OnInit, OnDestroy {
//   // Pagination variables
//   currentPage = 0;
//   pageSize = 10;
//   totalItems = 0;
//   totalPages = 0;
//   pageSizeOptions = [5, 10, 25, 50, 100];

//   // Sorting variables
//   sortField: string | null = null;
//   sortDirection = 'asc';

//   // Data and filtering
//   users: any[] = [];
//   filteredUsers: any[] = [];
//   searchText = '';
//   isLoading = false;
//   private destroy$ = new Subject<void>();

//   // Column definitions
//   displayedColumns: string[] = [
//     'position',
//     'name',
//     'email',
//     'username',
//     'phone',
//     'role',
//     'createdAt',
//     'updatedAt',
//     'actions'
//   ];

//   constructor(
//     private userService: UserAuthServiceService,
//     public dialog: MatDialog
//   ) { }

//   ngOnInit(): void {
//     this.loadUsers();
//   }

//   ngOnDestroy() {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   loadUsers(): void {
//     this.isLoading = true;
//     this.userService.getUsersPaginated(this.currentPage, this.pageSize, this.sortField, this.sortDirection)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: any) => {
//           this.isLoading = false;
//           this.users = response.users;
//           this.totalItems = response.totalItems;
//           this.totalPages = response.totalPages;
//           this.applyFilter();
//         },
//         error: (error) => {
//           this.isLoading = false;
//           Swal.fire({
//             icon: 'error',
//             title: error.status,
//             text: error.error?.message || 'Error while fetching data!',
//             confirmButtonText: 'OK'
//           });
//         }
//       });
//   }

//   // Get the row number considering pagination
//   getRowNumber(index: number): number {
//     return index + 1 + (this.currentPage * this.pageSize);
//   }

//   // Handle page changes
//   onPageChange(page: number): void {
//     this.currentPage = page;
//     this.loadUsers();
//   }

//   // Handle page size changes
//   onPageSizeChange(event: Event): void {
//     this.pageSize = parseInt((event.target as HTMLSelectElement).value, 10);
//     this.currentPage = 0; // Reset to first page when changing page size
//     this.loadUsers();
//   }

//   // Sort functionality
//   sortTable(field: string): void {
//     if (this.sortField === field) {
//       // Toggle direction if clicking the same column
//       this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//     } else {
//       // Set new sort field and default to ascending
//       this.sortField = field;
//       this.sortDirection = 'asc';
//     }
//     this.currentPage = 0; // Reset to first page when sorting
//     this.loadUsers();
//   }

//   // Get sort class for header
//   getSortClass(field: string): string {
//     if (this.sortField !== field) return 'sort-none';
//     return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
//   }

//   // Create array for pagination display
//   getPaginationArray(): number[] {
//     const maxPageButtons = 5;
//     const pages: number[] = [];

//     if (this.totalPages <= maxPageButtons) {
//       // Show all pages if total pages are less than or equal to max buttons
//       for (let i = 0; i < this.totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // Calculate which pages to show
//       const halfWay = Math.ceil(maxPageButtons / 2);

//       // If current page is less than halfway of max buttons
//       if (this.currentPage < halfWay) {
//         for (let i = 0; i < maxPageButtons; i++) {
//           pages.push(i);
//         }
//       }
//       // If current page is more than totalPages - halfway
//       else if (this.currentPage >= this.totalPages - halfWay) {
//         for (let i = this.totalPages - maxPageButtons; i < this.totalPages; i++) {
//           pages.push(i);
//         }
//       }
//       // If current page is in the middle
//       else {
//         for (let i = this.currentPage - Math.floor(maxPageButtons / 2); i <= this.currentPage + Math.floor(maxPageButtons / 2); i++) {
//           pages.push(i);
//         }
//       }
//     }

//     return pages;
//   }

//   // Filter function for local search (for quick filtering without server requests)
//   applyFilter(): void {
//     if (!this.searchText.trim()) {
//       this.filteredUsers = [...this.users];
//       return;
//     }

//     const searchTerm = this.searchText.toLowerCase().trim();
//     this.filteredUsers = this.users.filter(user =>
//       user.name?.toLowerCase().includes(searchTerm) ||
//       user.emailId?.toLowerCase().includes(searchTerm) ||
//       user.username?.toLowerCase().includes(searchTerm) ||
//       user.mobileNo?.toLowerCase().includes(searchTerm) ||
//       user.role?.toLowerCase().includes(searchTerm)
//     );
//   }

//   // Search with debounce for server-side filtering
//   onSearchChange(event: Event): void {
//     this.searchText = (event.target as HTMLInputElement).value;

//     // For simple client-side filtering
//     this.applyFilter();

//     // For server-side filtering (uncomment if implementing server-side search)
//     // clearTimeout(this.searchTimeout);
//     // this.searchTimeout = setTimeout(() => {
//     //   this.currentPage = 0;
//     //   this.loadUsers();
//     // }, 500);
//   }

//   openForm(): void {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: '600px',
//       data: { user: null }
//     });

//     dialogRef.afterClosed().pipe(
//       takeUntil(this.destroy$)
//     ).subscribe(result => {
//       if (result) {
//         this.loadUsers();
//       }
//     });
//   }

//   editUser(user: any): void {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       width: '600px',
//       data: { user: user }
//     });

//     dialogRef.afterClosed().pipe(
//       takeUntil(this.destroy$)
//     ).subscribe(result => {
//       if (result) {
//         this.loadUsers();
//       }
//     });
//   }

//   deleteUser(user: any): void {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6B7280",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.isLoading = true;
//         this.userService.deleteUser(user.username).pipe(
//           takeUntil(this.destroy$)
//         ).subscribe({
//           next: (response) => {
//             this.isLoading = false;
//             Swal.fire({
//               icon: 'success',
//               title: 'Deleted!',
//               text: response.message || 'User has been deleted.',
//               confirmButtonText: 'OK'
//             });
//             this.loadUsers();
//           },
//           error: (error) => {
//             this.isLoading = false;
//             Swal.fire({
//               icon: 'error',
//               title: error.status,
//               text: error.error?.message || 'Error deleting user!',
//               confirmButtonText: 'OK'
//             });
//           }
//         });
//       }
//     });
//   }

//   // Track function for ngFor performance optimization
//   trackByFn(index: number, user: any) {
//     return user.id || user.username;
//   }
// }