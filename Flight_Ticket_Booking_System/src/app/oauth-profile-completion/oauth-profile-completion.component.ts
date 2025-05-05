import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OAuthService } from "../services/oauth.service";
import { AuthService } from "../services/auth-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-oauth-profile-completion",
  standalone: false,
  templateUrl: "./oauth-profile-completion.component.html",
  styleUrls: ["./oauth-profile-completion.component.css"],
})
export class OAuthProfileCompletionComponent implements OnInit {
  profileData = {
    username: "",
    name: "",
    email: "",
    mobileNo: "",
  };

  token: string = "";
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oauthService: OAuthService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get params from URL
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get("token") || "";
      this.profileData.email = params.get("email") || "";
      this.profileData.name = params.get("name") || "";
    });

    if (!this.token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "No authentication token provided",
        confirmButtonText: "OK",
      }).then(() => {
        this.router.navigate(["/login"]);
      });
    }
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.isLoading = true;

      this.oauthService
        .completeOAuthProfile(this.profileData, this.token)
        .subscribe(
          (response) => {
            this.isLoading = false;

            // Store token and role
            this.authService.login(response.token, response.role, false);

            Swal.fire({
              icon: "success",
              title: "Profile Complete!",
              text: "Your profile has been completed successfully.",
              confirmButtonText: "OK",
            }).then(() => {
              if (response.role === "ADMIN") {
                this.router.navigate(["/admin"]);
              } else {
                this.router.navigate(["/"]);
              }
            });
          },
          (error) => {
            this.isLoading = false;
            const errorMessage =
              error.error?.message ||
              "Error completing profile. Please try again.";

            Swal.fire({
              icon: "error",
              title: "Profile Completion Failed",
              text: errorMessage,
              confirmButtonText: "OK",
            });
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
