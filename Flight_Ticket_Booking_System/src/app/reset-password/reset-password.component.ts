import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ResetPassword } from "../dtoClasses/reset-password"; // Import your DTO class
import Swal from "sweetalert2";
import { UserAuthServiceService } from "../services/user-auth-service.service"; // Assuming this service handles backend calls
import { Router, ActivatedRoute } from "@angular/router"; // Import ActivatedRoute for route parameters

@Component({
  selector: "app-reset-password",
  standalone: false,
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  resetPassword = new ResetPassword();
  username: string | null = null;
  timestamp: string | null = null;
  token: string | null = null;

  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService,
    private route: ActivatedRoute // Inject ActivatedRoute to get the route parameters
  ) { }

  // Add these properties to control password visibility
  showPassword: boolean = true;
  showConfirmPassword: boolean = true;

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit(): void {
    // Retrieve the route parameters for username, timestamp, and token
    this.route.paramMap.subscribe((params) => {
      this.username = params.get("username");
      this.timestamp = params.get("timestamp");
      this.token = params.get("token");
    });
  }

  onSubmit(resetPasswordForm: NgForm) {
    if (resetPasswordForm.valid) {
      const password = resetPasswordForm.value.password;
      const confirmPassword = resetPasswordForm.value.confirmPassword;

      // Check if password and confirm password match
      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "Passwords do not match. Please try again.",
          confirmButtonText: "OK",
        });
        return;
      }

      // Check if we have received all parameters
      if (!this.username || !this.timestamp || !this.token) {
        Swal.fire({
          icon: "error",
          title: "Invalid Request",
          text: "Missing parameters. Please try again.",
          confirmButtonText: "OK",
        });
        return;
      }

      // Assign password and confirmPassword to DTO
      this.resetPassword.password = password;
      this.resetPassword.confirmPassword = confirmPassword;

      // Show SweetAlert2 loading spinner
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we reset your password.',
        icon: 'info',
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading(); // Show loading spinner
        }
      });

      // Call the service to reset the password
      this.userAuthService
        .resetPassword(
          this.resetPassword,
          this.username,
          this.timestamp,
          this.token
        )
        .subscribe(
          (response) => {
            // Hide SweetAlert2 loading spinner and show success message
            Swal.close(); // Close the loading spinner
            Swal.fire({
              icon: "success",
              title: "Password Reset Successful!",
              text: response.message,
              confirmButtonText: "OK",
            }).then(() => {
              this.router.navigate(["/login"]);
            });
          },
          (error) => {
            // Hide SweetAlert2 loading spinner and show error message
            Swal.close(); // Close the loading spinner
            Swal.fire({
              icon: "error",
              title: "Password Reset Failed!",
              text:
                error.error.message ||
                "Something went wrong. Please try again.",
              confirmButtonText: "OK",
            });
            console.log(error);
          }
        );
    } else {
      Swal.fire({
        icon: "warning",
        title: "Form Invalid",
        text: "Please fill in all fields correctly.",
        confirmButtonText: "OK",
      });
    }
  }
}
