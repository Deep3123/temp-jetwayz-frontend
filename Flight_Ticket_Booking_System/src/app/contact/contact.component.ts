import { Component } from "@angular/core";
import { ContactServiceService } from "../services/contact-service.service";
import Swal from "sweetalert2";
import { isPlatformBrowser } from "@angular/common"; // Import isPlatformBrowser
import { PLATFORM_ID, Inject } from "@angular/core"; // Inject PLATFORM_ID to check the platform

@Component({
  selector: "app-contact",
  standalone: false,
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent {
  name: string = "";
  email: string = "";
  phoneNumber: string = "";
  message: string = "";

  isLoading: boolean = false;

  constructor(
    private service: ContactServiceService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID to check the platform
  ) {}

  // On form submission
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

    this.isLoading = true;

    this.service.saveContactData(contactRequest).subscribe(
      (response) => {
        this.isLoading = false;
        // Success popup (only in the browser)
        if (isPlatformBrowser(this.platformId)) {
          Swal.fire({
            icon: "success",
            title: "We received your query!",
            text: response.message,
            confirmButtonText: "OK",
          }).then(() => {
            // Reset form fields after success
            form.reset();
          });
        }
      },
      (error) => {
        this.isLoading = false;
        // Error popup (only in the browser)
        if (isPlatformBrowser(this.platformId)) {
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
      }
    );
  }
}
