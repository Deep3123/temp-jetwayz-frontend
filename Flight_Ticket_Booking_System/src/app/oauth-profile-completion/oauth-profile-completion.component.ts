import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OAuthService } from "../services/oauth.service";
import { AuthService } from "../services/auth-service.service";
import Swal from "sweetalert2";
import { isPlatformBrowser } from "@angular/common";

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
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParamMap.subscribe((params) => {
        if (params) {
          this.token = params.get("token") || "";
          this.profileData.email = params.get("email") || "";
          this.profileData.name = params.get("name") || "";
  
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
        } else {
          // Handle case where params is undefined
          console.error("Query parameters are undefined");
          this.router.navigate(["/login"]);
        }
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

            this.authService.login(response.token, response.role, false);

            if (isPlatformBrowser(this.platformId)) {
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
            }
          },
          (error) => {
            this.isLoading = false;
            const errorMessage =
              error.error?.message ||
              "Error completing profile. Please try again.";

            if (isPlatformBrowser(this.platformId)) {
              Swal.fire({
                icon: "error",
                title: "Profile Completion Failed",
                text: errorMessage,
                confirmButtonText: "OK",
              });
            }
          }
        );
    } else {
      if (isPlatformBrowser(this.platformId)) {
        Swal.fire({
          icon: "warning",
          title: "Form Invalid",
          text: "Please fill in all fields correctly.",
          confirmButtonText: "OK",
        });
      }
    }
  }
}
