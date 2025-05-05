import { Component, OnInit } from "@angular/core";
import { UserAuthServiceService } from "../services/user-auth-service.service";
import Swal from "sweetalert2";
import { AuthService } from "../services/auth-service.service";

@Component({
  selector: "app-home",
  standalone: false,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
// export class HomeComponent implements OnInit {
export class HomeComponent {

  // constructor(
  //   private userAuthService: UserAuthServiceService,
  //   private authService: AuthService
  // ) {}
  // ngOnInit(): void {
  //   this.userAuthService.checkAccountExists().subscribe(
  //     (response) => {},
  //     (error) => {
  //       console.log(error);
  //       // ✅ Ensure error message is displayed properly
  //       const errorMessage =
  //         error.error?.message || error.error?.error?.message;
  //       Swal.fire({
  //         icon: "error",
  //         title: "Login Failed!",
  //         text:
  //           errorMessage ||
  //           "We couldn't log you in. Your account may have been deleted, or you might not be logged in. Please try again. If the issue persists, consider creating a new account.",
  //         confirmButtonText: "OK",
  //       });
  //       // this.router.navigate(["/"]);
  //       this.authService.logout(); // ✅ Ensure user is logged out
  //     }
  //   );
  // }
}
