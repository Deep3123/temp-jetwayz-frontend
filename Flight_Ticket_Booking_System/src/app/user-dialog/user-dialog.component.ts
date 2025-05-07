import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import Swal from "sweetalert2";
import { NgForm } from "@angular/forms";
import { isPlatformBrowser } from "@angular/common"; // ✅ SSR-safe check

@Component({
  selector: "app-user-dialog",
  standalone: false,
  templateUrl: "./user-dialog.component.html",
  styleUrls: ["./user-dialog.component.css"],
})
export class UserDialogComponent {
  isEditing = false;
  isLoading = false;
  selectedUser: any = {};

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserAuthServiceService,
    @Inject(PLATFORM_ID) private platformId: Object // ✅ Inject platform info
  ) {
    if (data.user) {
      this.isEditing = true;
      this.selectedUser = { ...data.user };
    }
  }

  onNoClick(): void {
    if (isPlatformBrowser(this.platformId)) {
      Swal.fire({
        icon: "info",
        title: "Update Operation Cancelled!",
        text: "The user information was not updated, as you cancelled the operation.",
        confirmButtonText: "OK",
      });
    }
    this.dialogRef.close();
  }

  submitForm(userForm: NgForm): void {
    if (!userForm.valid) {
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "warning",
          title: "Form Invalid",
          text: "Please fill in all required fields.",
          confirmButtonText: "OK",
        });
      }
      return;
    }

    this.isLoading = true;

    const request$ = this.isEditing
      ? this.userService.updateUser({ ...this.selectedUser, ...userForm.value })
      : this.userService.saveUserData(userForm.value);

    request$.subscribe(
      (response) => {
        this.isLoading = false;
        this.dialogRef.close();

        if (isPlatformBrowser(this.platformId)) {
          Swal.fire({
            icon: "success",
            title: this.isEditing
              ? "User Updated Successfully!"
              : "User Added Successfully!",
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
            title: this.isEditing
              ? "Error Updating User!"
              : "Error Adding User!",
            text:
              error?.error?.message || error.message || "Something went wrong.",
            confirmButtonText: "OK",
          });
        }
      }
    );
  }
}
