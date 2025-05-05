import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { ContactServiceService } from "../services/contact-service.service";

@Component({
  selector: "app-contact-us-dialog",
  standalone: false,
  templateUrl: "./contact-us-dialog.component.html",
  styleUrls: ["./contact-us-dialog.component.css"],
})
export class ContactUsDialogComponent {
  contact: any;

  constructor(
    public dialogRef: MatDialogRef<ContactUsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contactService: ContactServiceService
  ) {
    this.contact = data.contact;
  }

  onNoClick(): void {
    Swal.fire({
      icon: "info",
      title: "Contact Query Closed",
      text: "You have closed the contact request details.",
      confirmButtonText: "OK",
    });
    this.dialogRef.close();
  }

  // Delete the contact directly from the dialog
  deleteContact(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(this.contact.id).subscribe(
          (response) => {
            Swal.fire({
              icon: "success",
              title: "Deleted Successfully!",
              text: "The contact query has been deleted.",
              confirmButtonText: "OK",
            });
            this.dialogRef.close();
          },
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Error Deleting Query",
              text: "There was an issue deleting the contact query.",
              confirmButtonText: "OK",
            });
          }
        );
      }
    });
  }
}
