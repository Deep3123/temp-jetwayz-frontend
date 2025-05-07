import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ResetPassword } from "../dtoClasses/reset-password";
import Swal from "sweetalert2";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

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

  showPassword: boolean = true;
  showConfirmPassword: boolean = true;

  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit(): void {
    // Use observable instead of snapshot for SSR safety
    this.route.paramMap.subscribe((params) => {
      if (params) {
        this.username = params.get("username");
        this.timestamp = params.get("timestamp");
        this.token = params.get("token");

        if (!this.username || !this.timestamp || !this.token) {
          if (isPlatformBrowser(this.platformId)) {
            Swal.fire({
              icon: "error",
              title: "Invalid Request",
              text: "Missing parameters. Please try again.",
              confirmButtonText: "OK",
            }).then(() => {
              this.router.navigateByUrl("/");
            });
          }
        }
      } else {
        // Handle case where params is undefined
        console.error("Route parameters are undefined");
        if (isPlatformBrowser(this.platformId)) {
          Swal.fire({
            icon: "error",
            title: "Navigation Error",
            text: "Could not retrieve necessary parameters.",
            confirmButtonText: "OK",
          }).then(() => {
            this.router.navigateByUrl("/");
          });
        }
      }
    });
  }

  onSubmit(resetPasswordForm: NgForm) {
    if (!resetPasswordForm.valid) {
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "warning",
          title: "Form Invalid",
          text: "Please fill in all fields correctly.",
          confirmButtonText: "OK",
        });
      }
      return;
    }

    const { password, confirmPassword } = resetPasswordForm.value;

    if (password !== confirmPassword) {
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "Passwords do not match. Please try again.",
          confirmButtonText: "OK",
        });
      }
      return;
    }

    if (!this.username || !this.timestamp || !this.token) {
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Request",
          text: "Missing parameters. Please try again.",
          confirmButtonText: "OK",
        });
      }
      return;
    }

    this.resetPassword.password = password;
    this.resetPassword.confirmPassword = confirmPassword;

    if (isPlatformBrowser(this.platformId)) {
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we reset your password.",
        icon: "info",
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
    }

    this.userAuthService
      .resetPassword(
        this.resetPassword,
        this.username,
        this.timestamp,
        this.token
      )
      .subscribe(
        (response) => {
          if (isPlatformBrowser(this.platformId)) {
            Swal.close();
            Swal.fire({
              icon: "success",
              title: "Password Reset Successful!",
              text: response.message,
              confirmButtonText: "OK",
            }).then(() => {
              this.router.navigate(["/login"]);
            });
          }
        },
        (error) => {
          if (isPlatformBrowser(this.platformId)) {
            Swal.close();
            Swal.fire({
              icon: "error",
              title: "Password Reset Failed!",
              text:
                error.error?.message ||
                "Something went wrong. Please try again.",
              confirmButtonText: "OK",
            });
          }
          console.error("Password reset error:", error);
        }
      );
  }
}
