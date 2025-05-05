import { Component, OnInit } from "@angular/core";
import { ContactServiceService } from "../services/contact-service.service";
import Swal from "sweetalert2";
import { AuthService } from "../services/auth-service.service";
import { UserAuthServiceService } from "../services/user-auth-service.service";

@Component({
  selector: "app-contact",
  standalone: false,
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
// export class ContactComponent implements OnInit {
  export class ContactComponent{

  name: string = "";
  email: string = "";
  phoneNumber: string = "";
  message: string = "";

  isLoading: boolean = false;

  constructor(
    private service: ContactServiceService,
    // private userAuthService: UserAuthServiceService,
    // private authService: AuthService
  ) {}

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

  onSubmit(form: any) {
    if (form.invalid) {
      return;
    }

    const contactRequest = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      message: this.message,
    };

    this.isLoading=true;

    this.service.saveContactData(contactRequest).subscribe(
      (response) => {

        this.isLoading=false;
        // Success popup
        Swal.fire({
          icon: "success",
          title: "We received your query!",
          text: response.message,
          confirmButtonText: "OK",
        }).then(() => {
          // Reset form fields after success
          form.reset();
        });
      },
      (error) => {
        this.isLoading=false;
        // Error popup
        let errorMessage = "Something went wrong. Please try again later.";

        if (error.error && error.error.message) {
          errorMessage = error.error.message; // If error contains a custom message from backend
        }

        Swal.fire({
          icon: "error",
          title: "Oops, something went wrong!",
          text: errorMessage,
          confirmButtonText: "OK",
        });
      }
    );
  }
}
