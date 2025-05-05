import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { LoginReq } from "../dtoClasses/login-req";
import Swal from "sweetalert2";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth-service.service";
import { CaptchaServiceService } from "../services/captcha-service.service";
import {
  GoogleLoginProvider,
  SocialAuthService,
} from "@abacritt/angularx-social-login";

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService,
    private authService: AuthService,
    private captchaService: CaptchaServiceService,
    private socialAuthService: SocialAuthService
  ) { }

  login = new LoginReq();
  captchaInput: string = "";
  captchaUrl: string = ""; // Will hold the CAPTCHA image URL
  isLoading: any = false;

  // Add this property to control password visibility
  showPassword: boolean = true;

  // Get a fresh CAPTCHA image when the component is initialized
  ngOnInit() {
    this.loadCaptcha();

    // Subscribe to social login events
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        console.log("Logged in with:", user.provider);
        console.log("User data:", user);

        // For Google OAuth, the backend handles the authentication
        // We don't need to do anything here as the backend will redirect
        // to the appropriate URL
      }
    });
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loadCaptcha() {
    // Reset captchaUrl to trigger loading animation
    this.captchaUrl = "";

    this.captchaService.getCaptchaImage().subscribe(
      (response: Blob) => {
        // Small artificial delay to show loading animation (remove in production)
        setTimeout(() => {
          // Create a URL for the blob image
          this.captchaUrl = URL.createObjectURL(response);
        }, 800);
      },
      (error) => {
        // ✅ Ensure error message is displayed properly
        const errorMessage =
          error.message ||
          error.error?.message ||
          "Error fetching CAPTCHA image.";

        Swal.fire({
          icon: "error",
          title: "Captcha not loading!",
          text: errorMessage,
          confirmButtonText: "OK",
        });
      }
    );
  }

  // Method to reload CAPTCHA image
  reloadCaptcha() {
    this.loadCaptcha(); // Simply reload the CAPTCHA by calling the loadCaptcha method again
  }

  onSubmit(form: any) {
    if (form.valid) {
      // console.log(form.value);

      this.login.username = form.value.username;
      this.login.password = form.value.password;
      this.login.captchaInput = form.value.captchaInput; // ✅ include captcha input

      // Get the remember me value from the form
      const rememberMe = form.value.rememberMe || false;

      this.isLoading = true;
      this.userAuthService.userLogin(this.login).subscribe(
        (response) => {
          this.isLoading = false;
          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "You have successfully logged in.",
            confirmButtonText: "OK",
          }).then(() => {
            form.reset();
            // Store token and role in AuthService with rememberMe flag
            this.authService.login(response.token, response.role, rememberMe);
            // Redirect based on role
            if (response.role === "ADMIN") {
              this.router.navigate(["/admin"]);
            } else if (response.role === "USER") {
              this.router.navigate(["/"]);
            }
          });
        },
        (error) => {
          this.isLoading = false;
          console.log(error);

          // ✅ Ensure error message is displayed properly
          const errorMessage =
            error.error?.message ||
            error.error?.error?.message ||
            "Login failed. Please try again.";

          Swal.fire({
            icon: "error",
            title: "Login Failed!",
            text: errorMessage,
            confirmButtonText: "OK",
          });
          this.reloadCaptcha();
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

  // Method to initiate Google OAuth login
  // signInWithGoogle(): void {
  //   this.isLoading = true;

  //   // Redirect to backend OAuth endpoint
  //   window.location.href = "http://localhost:4200/oauth/complete-profile";

  //   // window.location.href = "https://jetwayz.vercel.app/oauth/complete-profile";

  //   // Note: The backend will handle the OAuth flow and redirect back to the frontend
  //   // There's no need to use the SocialAuthService signIn method as we're using the backend for OAuth
  // }

  signInWithGoogle(): void {
    this.isLoading = true;
    // Redirect to backend OAuth endpoint - choose one based on environment
    // window.location.href = "http://localhost:8080/oauth2/authorization/google?env=local"; // Development
    window.location.href = "https://jetwayz-backend.onrender.com/oauth2/authorization/google?env=prod"; // Production
  }
}
