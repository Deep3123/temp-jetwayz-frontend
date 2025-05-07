import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';  // Import isPlatformBrowser
import Swal from "sweetalert2";

@Component({
  selector: "app-forgot-password",
  standalone: false,
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent {
  isLoading: boolean = false;
  emailSent: boolean = false; // Track if email has been sent successfully
  userEmail: string = ""; // Store the email to display in success message

  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService,
    @Inject(PLATFORM_ID) private platformId: any // Inject PLATFORM_ID to detect platform
  ) {}

  onSubmit(forgotPasswordForm: NgForm) {
    if (forgotPasswordForm.valid) {
      const email = forgotPasswordForm.value.email;
      // Store email for success message
      this.userEmail = email;

      this.isLoading = true;
      console.log("Loading started...");

      this.userAuthService.forgotPassword(email).subscribe(
        (response) => {
          this.isLoading = false;
          console.log("Loading finished");

          // Set emailSent to true to show success view
          this.emailSent = true;

          // Use SweetAlert2 only in the browser
          if (isPlatformBrowser(this.platformId)) {
            Swal.fire({
              icon: "success",
              title: "Email Sent Successfully!",
              text: response.message,
              confirmButtonText: "OK",
            });
          }
        },
        (error) => {
          this.isLoading = false;
          console.error("Error occurred:", error);

          const errorMsg =
            error?.error?.message || error?.message || "Something went wrong!";

          // Use SweetAlert2 only in the browser
          if (isPlatformBrowser(this.platformId)) {
            Swal.fire({
              icon: "error",
              title: "Email has not been sent!",
              text: errorMsg,
              confirmButtonText: "OK",
            });
          }
        }
      );
    } else {
      // Use SweetAlert2 only in the browser
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "warning",
          title: "Form Invalid",
          text: "Please enter a valid email address.",
          confirmButtonText: "OK",
        });
      }
    }
  }

  // Go back to login page
  goToLogin() {
    // Use router only in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(["/login"]);
    }
  }
}
