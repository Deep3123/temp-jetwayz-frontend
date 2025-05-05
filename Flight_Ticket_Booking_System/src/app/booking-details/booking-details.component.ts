import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { BookingServiceService } from "../services/booking-service.service";
declare var Razorpay: any;

@Component({
  selector: "app-booking-details",
  standalone: false,
  templateUrl: "./booking-details.component.html",
  styleUrls: ["./booking-details.component.css"],
})
export class BookingDetailsComponent implements OnInit {
  selectedFlight: any;
  passengerCount: number = 1;

  isLoading: boolean = false; // Add this flag to control spinner visibility

  // Initialize passengers with dynamic country code and mobile
  passengers: any[] = [];

  // Set the default country code to India (+91)
  countryCodes: any[] = [
    { code: "+91", country: "India" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+65", country: "Singapore" },
    { code: "+971", country: "UAE" },
    { code: "+81", country: "Japan" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+39", country: "Italy" },
    { code: "+34", country: "Spain" },
    { code: "+55", country: "Brazil" },
    { code: "+86", country: "China" },
    { code: "+7", country: "Russia" },
    { code: "+27", country: "South Africa" },
    { code: "+60", country: "Malaysia" },
    { code: "+34", country: "Spain" },
    { code: "+52", country: "Mexico" },
    { code: "+54", country: "Argentina" },
    { code: "+93", country: "Afghanistan" },
    { code: "+355", country: "Albania" },
    { code: "+213", country: "Algeria" },
    { code: "+1684", country: "American Samoa" },
    { code: "+376", country: "Andorra" },
    { code: "+244", country: "Angola" },
    { code: "+672", country: "Australia External Territories" },
    { code: "+1264", country: "Anguilla" },
    { code: "+1268", country: "Antigua and Barbuda" },
    { code: "+54", country: "Argentina" },
    { code: "+374", country: "Armenia" },
    { code: "+297", country: "Aruba" },
    { code: "+247", country: "Ascension Island" },
    { code: "+61", country: "Australia" },
    { code: "+43", country: "Austria" },
    { code: "+994", country: "Azerbaijan" },
    { code: "+1242", country: "Bahamas" },
    { code: "+973", country: "Bahrain" },
    { code: "+880", country: "Bangladesh" },
    { code: "+1246", country: "Barbados" },
    { code: "+375", country: "Belarus" },
    { code: "+32", country: "Belgium" },
    { code: "+501", country: "Belize" },
    { code: "+229", country: "Benin" },
    { code: "+975", country: "Bhutan" },
    { code: "+591", country: "Bolivia" },
    { code: "+387", country: "Bosnia and Herzegovina" },
    { code: "+267", country: "Botswana" },
    { code: "+55", country: "Brazil" },
    { code: "+1284", country: "British Virgin Islands" },
    { code: "+673", country: "Brunei Darussalam" },
    { code: "+359", country: "Bulgaria" },
    { code: "+226", country: "Burkina Faso" },
    { code: "+257", country: "Burundi" },
    { code: "+855", country: "Cambodia" },
    { code: "+237", country: "Cameroon" },
    { code: "+1", country: "Canada" },
    { code: "+238", country: "Cape Verde" },
    { code: "+1345", country: "Cayman Islands" },
    { code: "+236", country: "Central African Republic" },
    { code: "+56", country: "Chile" },
    { code: "+86", country: "China" },
    { code: "+61", country: "Christmas Island" },
    { code: "+61", country: "Cocos Islands" },
    { code: "+57", country: "Colombia" },
    { code: "+269", country: "Comoros" },
    { code: "+242", country: "Congo (Republic)" },
    { code: "+243", country: "Congo (Democratic Republic)" },
    { code: "+682", country: "Cook Islands" },
    { code: "+506", country: "Costa Rica" },
    { code: "+225", country: "Cote d'Ivoire" },
    { code: "+385", country: "Croatia" },
    { code: "+53", country: "Cuba" },
    { code: "+599", country: "Curacao" },
    { code: "+357", country: "Cyprus" },
    { code: "+420", country: "Czech Republic" },
    { code: "+45", country: "Denmark" },
    { code: "+253", country: "Djibouti" },
    { code: "+1", country: "Dominica" },
    { code: "+1809", country: "Dominican Republic" },
    { code: "+593", country: "Ecuador" },
    { code: "+20", country: "Egypt" },
    { code: "+503", country: "El Salvador" },
    { code: "+240", country: "Equatorial Guinea" },
    { code: "+291", country: "Eritrea" },
    { code: "+372", country: "Estonia" },
    { code: "+251", country: "Ethiopia" },
    { code: "+500", country: "Falkland Islands" },
    { code: "+298", country: "Faroe Islands" },
    { code: "+679", country: "Fiji" },
    { code: "+358", country: "Finland" },
    { code: "+33", country: "France" },
    { code: "+594", country: "French Guiana" },
    { code: "+689", country: "French Polynesia" },
    { code: "+241", country: "Gabon" },
    { code: "+220", country: "Gambia" },
    { code: "+995", country: "Georgia" },
    { code: "+49", country: "Germany" },
    { code: "+233", country: "Ghana" },
    { code: "+350", country: "Gibraltar" },
    { code: "+30", country: "Greece" },
    { code: "+299", country: "Greenland" },
    { code: "+1473", country: "Grenada" },
    { code: "+590", country: "Guadeloupe" },
    { code: "+502", country: "Guatemala" },
    { code: "+44", country: "Guernsey" },
    { code: "+224", country: "Guinea" },
    { code: "+245", country: "Guinea-Bissau" },
    { code: "+592", country: "Guyana" },
    { code: "+509", country: "Haiti" },
    { code: "+504", country: "Honduras" },
    { code: "+852", country: "Hong Kong" },
    { code: "+36", country: "Hungary" },
    { code: "+354", country: "Iceland" },
    { code: "+91", country: "India" },
    { code: "+62", country: "Indonesia" },
    { code: "+98", country: "Iran" },
    { code: "+964", country: "Iraq" },
    { code: "+353", country: "Ireland" },
    { code: "+972", country: "Israel" },
    { code: "+39", country: "Italy" },
    { code: "+1", country: "Jamaica" },
    { code: "+81", country: "Japan" },
    { code: "+962", country: "Jordan" },
    { code: "+254", country: "Kenya" },
    { code: "+686", country: "Kiribati" },
    { code: "+965", country: "Kuwait" },
    { code: "+996", country: "Kyrgyzstan" },
    { code: "+856", country: "Laos" },
    { code: "+371", country: "Latvia" },
    { code: "+961", country: "Lebanon" },
    { code: "+266", country: "Lesotho" },
    { code: "+231", country: "Liberia" },
    { code: "+218", country: "Libya" },
    { code: "+423", country: "Liechtenstein" },
    { code: "+370", country: "Lithuania" },
    { code: "+352", country: "Luxembourg" },
    { code: "+853", country: "Macao" },
    { code: "+261", country: "Madagascar" },
    { code: "+265", country: "Malawi" },
    { code: "+60", country: "Malaysia" },
    { code: "+960", country: "Maldives" },
    { code: "+223", country: "Mali" },
    { code: "+356", country: "Malta" },
    { code: "+692", country: "Marshall Islands" },
    { code: "+596", country: "Martinique" },
    { code: "+222", country: "Mauritania" },
    { code: "+230", country: "Mauritius" },
    { code: "+262", country: "Mayotte" },
    { code: "+52", country: "Mexico" },
    { code: "+691", country: "Micronesia" },
    { code: "+373", country: "Moldova" },
    { code: "+377", country: "Monaco" },
    { code: "+976", country: "Mongolia" },
    { code: "+382", country: "Montenegro" },
    { code: "+1", country: "Montserrat" },
    { code: "+212", country: "Morocco" },
    { code: "+258", country: "Mozambique" },
    { code: "+95", country: "Myanmar" },
    { code: "+264", country: "Namibia" },
    { code: "+674", country: "Nauru" },
    { code: "+977", country: "Nepal" },
    { code: "+31", country: "Netherlands" },
    { code: "+64", country: "New Zealand" },
    { code: "+505", country: "Nicaragua" },
    { code: "+227", country: "Niger" },
    { code: "+234", country: "Nigeria" },
    { code: "+683", country: "Niue" },
    { code: "+850", country: "North Korea" },
    { code: "+47", country: "Norway" },
    { code: "+968", country: "Oman" },
    { code: "+92", country: "Pakistan" },
    { code: "+680", country: "Palau" },
    { code: "+970", country: "Palestinian Territories" },
    { code: "+507", country: "Panama" },
    { code: "+675", country: "Papua New Guinea" },
    { code: "+595", country: "Paraguay" },
    { code: "+51", country: "Peru" },
    { code: "+63", country: "Philippines" },
    { code: "+48", country: "Poland" },
    { code: "+351", country: "Portugal" },
    { code: "+1787", country: "Puerto Rico" },
    { code: "+974", country: "Qatar" },
    { code: "+40", country: "Romania" },
    { code: "+7", country: "Russia" },
    { code: "+250", country: "Rwanda" },
    { code: "+685", country: "Samoa" },
    { code: "+378", country: "San Marino" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+221", country: "Senegal" },
    { code: "+381", country: "Serbia" },
    { code: "+248", country: "Seychelles" },
    { code: "+232", country: "Sierra Leone" },
    { code: "+65", country: "Singapore" },
    { code: "+421", country: "Slovakia" },
    { code: "+386", country: "Slovenia" },
    { code: "+677", country: "Solomon Islands" },
    { code: "+252", country: "Somalia" },
    { code: "+27", country: "South Africa" },
    { code: "+34", country: "Spain" },
    { code: "+94", country: "Sri Lanka" },
    { code: "+249", country: "Sudan" },
    { code: "+597", country: "Suriname" },
    { code: "+268", country: "Eswatini" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
    { code: "+963", country: "Syria" },
    { code: "+886", country: "Taiwan" },
    { code: "+255", country: "Tanzania" },
    { code: "+66", country: "Thailand" },
    { code: "+670", country: "Timor-Leste" },
    { code: "+228", country: "Togo" },
    { code: "+676", country: "Tonga" },
    { code: "+1", country: "Trinidad and Tobago" },
    { code: "+216", country: "Tunisia" },
    { code: "+90", country: "Turkey" },
    { code: "+993", country: "Turkmenistan" },
    { code: "+1", country: "Turks and Caicos Islands" },
    { code: "+688", country: "Tuvalu" },
    { code: "+256", country: "Uganda" },
    { code: "+380", country: "Ukraine" },
    { code: "+971", country: "United Arab Emirates" },
    { code: "+44", country: "United Kingdom" },
    { code: "+1", country: "United States" },
    { code: "+598", country: "Uruguay" },
    { code: "+998", country: "Uzbekistan" },
    { code: "+678", country: "Vanuatu" },
    { code: "+58", country: "Venezuela" },
    { code: "+84", country: "Vietnam" },
    { code: "+1284", country: "Virgin Islands" },
    { code: "+967", country: "Yemen" },
    { code: "+260", country: "Zambia" },
    { code: "+263", country: "Zimbabwe" },
  ];

  // This function will return the country name based on the country code
  getCountryNameByCode(code: string): string {
    const country = this.countryCodes.find((c) => c.code === code);
    return country ? country.country : "Select Country"; // Default placeholder if country not found
  }

  filteredCountryCodes: any[] = this.countryCodes;
  selectedCountry: string = ""; // Default to empty, let user type
  isCountryInputFocused: boolean = false;

  constructor(private router: Router, private service: BookingServiceService) {
    const nav = this.router.getCurrentNavigation();
    this.selectedFlight = nav?.extras?.state?.["flight"] || null;
    this.passengerCount = nav?.extras?.state?.["count"] || 1;

    // Initialize passengers array
    this.initializePassengersForm();
  }

  ngOnInit(): void {
    if (!this.selectedFlight) {
      this.router.navigate(["/flight-results"]);
    }
  }

  // Initialize the passengers array based on passenger count
  initializePassengersForm(): void {
    this.passengers = [];
    for (let i = 0; i < this.passengerCount; i++) {
      this.passengers.push({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        countryCode: "+91", // Default to India for all passengers
        mobile: "",
      });
    }
  }

  // Filter countries based on the user's input (search query)
  filterCountryCodes(query: string): void {
    if (query) {
      this.filteredCountryCodes = this.countryCodes.filter(
        (country) =>
          country.country.toLowerCase().includes(query.toLowerCase()) ||
          country.code.startsWith(query)
      );
    } else {
      this.filteredCountryCodes = this.countryCodes;
    }
  }

  // Handle the selection of a country from the filtered list
  selectCountry(country: { country: string; code: string }): void {
    this.selectedCountry = country.country; // Update selected country text
    this.passengers.forEach((passenger) => {
      passenger.countryCode = country.code; // Update country code for each passenger
    });
    this.filteredCountryCodes = []; // Clear suggestions after selection
    this.isCountryInputFocused = false; // Optionally, remove focus after selection
  }

  // Calculate total price
  getTotalPrice(): number {
    return this.selectedFlight
      ? this.selectedFlight.price * this.passengerCount
      : 0;
  }

  // Handle form submission
  // onSubmit(): void {
  //   const totalAmount = this.getTotalPrice() * 100; // Razorpay accepts paise

  //   const options: any = {
  //     key: "rzp_test_pIqGo2X8aqQ6ja",
  //     amount: totalAmount,
  //     currency: "INR",
  //     name: "JetWayz",
  //     description: "Flight Booking Payment",
  //     handler: (response: any) => {
  //       // Send response to Spring Boot to verify + handle ticket
  //       // // Show spinner before starting the API call
  //       // this.isLoading = true;

  //       const bookingPayload = {
  //         paymentId: response.razorpay_payment_id,
  //         passenger: this.passengers[0],
  //         flightId: this.selectedFlight.flightNumber,
  //         amount: totalAmount / 100,
  //         count: this.passengerCount,
  //       };

  //       const ticketPayload = {
  //         paymentId: response.razorpay_payment_id,
  //         passengers: this.passengers,
  //         flight: this.selectedFlight,
  //         amount: totalAmount / 100,
  //       };

  //       this.service.createBooking(bookingPayload).subscribe(
  //         (response) => {
  //           // Assuming the response contains a booking reference or any important info:
  //           const bookingReference = response.message || "N/A";

  //           Swal.fire({
  //             title: "Success!",
  //             text: `Booking Reference: ${bookingReference}`,
  //             icon: "success",
  //             confirmButtonText: "OK",
  //           }).then(() => {
  //             // Show spinner before starting the API call
  //             this.isLoading = true;
  //             // You can call getBookingById() here after success if needed
  //             this.service.generatePdfOfTicket(ticketPayload).subscribe(
  //               (response) => {
  //                 // Assuming the response contains a booking reference or any important info:
  //                 const message = response.message || "N/A";

  //                 Swal.fire({
  //                   title: "Success!",
  //                   text: message,
  //                   icon: "success",
  //                   confirmButtonText: "OK",
  //                 }).then(() => {
  //                   this.router.navigate(["/"]);
  //                 });
  //               },
  //               (error) => {
  //                 let errorMessage = "Something went wrong. Try again.";

  //                 // You can add more specific error handling based on the error response
  //                 if (error.error && error.error.message) {
  //                   errorMessage = error.error.message;
  //                 } else if (error.status === 400) {
  //                   errorMessage =
  //                     "Invalid input. Please check your booking details and try again."; // If backend sends a more specific error message
  //                 } else if (error.status === 500) {
  //                   errorMessage = "Server error. Please try again later.";
  //                 }

  //                 Swal.fire({
  //                   title: "Error",
  //                   text: errorMessage,
  //                   icon: "error",
  //                   confirmButtonText: "OK",
  //                 });
  //               }
  //             );
  //           });
  //         },
  //         (error) => {
  //           let errorMessage = "Something went wrong. Try again.";

  //           // You can add more specific error handling based on the error response
  //           if (error.message && error.error.message) {
  //             errorMessage = error.message || error.error.message;
  //           } else if (error.status === 400) {
  //             errorMessage =
  //               "Invalid input. Please check your booking details and try again."; // If backend sends a more specific error message
  //           } else if (error.status === 500) {
  //             errorMessage = "Server error. Please try again later.";
  //           }

  //           Swal.fire({
  //             title: "Error",
  //             text: errorMessage,
  //             icon: "error",
  //             confirmButtonText: "OK",
  //           });
  //         }
  //       );
  //     },
  //     prefill: {
  //       name: this.passengers[0].firstName + " " + this.passengers[0].lastName,
  //       email: this.passengers[0].email,
  //       contact: this.passengers[0].mobile,
  //     },
  //     theme: {
  //       color: "#0062cc",
  //     },
  //   };

  //   // Call Razorpay checkout
  //   const rzp1 = new Razorpay(options);
  //   rzp1.open();
  // }

  // onSubmit(): void {
  //   this.isLoading = false; // Start loader
  //   this.setSpinnerTimeout(); // Add this line

  //   const totalAmount = this.getTotalPrice() * 100; // Razorpay uses paise
  //   const options: any = {
  //     key: "rzp_test_pIqGo2X8aqQ6ja",
  //     amount: totalAmount,
  //     currency: "INR",
  //     name: "JetWayz",
  //     description: "Flight Booking Payment",
  //     handler: (response: any) => {
  //       // Keep spinner active during backend processing
  //       const bookingPayload = {
  //         paymentId: response.razorpay_payment_id,
  //         passenger: this.passengers[0],
  //         flightId: this.selectedFlight.flightNumber,
  //         amount: totalAmount / 100,
  //         count: this.passengerCount,
  //       };

  //       const ticketPayload = {
  //         paymentId: response.razorpay_payment_id,
  //         passengers: this.passengers,
  //         flight: this.selectedFlight,
  //         amount: totalAmount / 100,
  //       };

  //       this.service.createBooking(bookingPayload).subscribe(
  //         (res) => {
  //           // IMPORTANT: Hide spinner before showing any alerts
  //           this.isLoading = false;

  //           const bookingReference = res.message || "N/A";
  //           Swal.fire({
  //             title: "Success!",
  //             text: `Booking Reference: ${bookingReference}`,
  //             icon: "success",
  //             confirmButtonText: "OK",
  //           }).then(() => {
  //             // Show spinner again for ticket generation
  //             this.isLoading = true;

  //             this.service.generatePdfOfTicket(ticketPayload).subscribe(
  //               (res2) => {
  //                 // Hide spinner before showing alert
  //                 this.isLoading = false;

  //                 Swal.fire({
  //                   title: "Ticket Generated!",
  //                   text: res2.message || "Your ticket has been sent!",
  //                   icon: "success",
  //                   confirmButtonText: "OK",
  //                 }).then(() => {
  //                   // Show spinner for navigation
  //                   this.isLoading = true;
  //                   this.router.navigate(["/"]).then(() => {
  //                     // IMPORTANT: Hide spinner after navigation completes
  //                     this.isLoading = false;
  //                   });
  //                 });
  //               },
  //               (error) => {
  //                 // Hide spinner on error
  //                 this.isLoading = false;

  //                 Swal.fire({
  //                   title: "Error",
  //                   text: "Ticket generation failed. Try again.",
  //                   icon: "error",
  //                   confirmButtonText: "OK",
  //                 });
  //               }
  //             );
  //           });
  //         },
  //         (error) => {
  //           // Hide spinner on error
  //           this.isLoading = false;

  //           let errorMessage = "Something went wrong during payment verification.";
  //           if (error.error && error.error.message) {
  //             errorMessage = error.error.message;
  //           }

  //           Swal.fire({
  //             title: "Payment Failed",
  //             text: errorMessage,
  //             icon: "error",
  //             confirmButtonText: "OK",
  //           });
  //         }
  //       );
  //     },
  //     prefill: {
  //       name: this.passengers[0].firstName + " " + this.passengers[0].lastName,
  //       email: this.passengers[0].email,
  //       contact: this.passengers[0].mobile,
  //     },
  //     theme: {
  //       color: "#0062cc",
  //     },
  //     // IMPORTANT: Add modal closing handler to hide spinner if payment modal is closed
  //     modal: {
  //       ondismiss: () => {
  //         this.isLoading = false;
  //       }
  //     }
  //   };

  //   const rzp1 = new Razorpay(options);

  //   try {
  //     // Hide spinner when Razorpay popup opens
  //     rzp1.on('ready', () => {
  //       this.isLoading = false;
  //     });

  //     rzp1.open();
  //   } catch (error) {
  //     // Hide spinner on error
  //     this.isLoading = false;

  //     Swal.fire({
  //       title: "Error",
  //       text: "Unable to open Razorpay. Please try again.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // }

  // private setSpinnerTimeout() {
  //   setTimeout(() => {
  //     if (this.isLoading) {
  //       console.warn('Spinner safeguard activated - forcing spinner to hide after timeout');
  //       this.isLoading = false;
  //     }
  //   }, 30000); // 30 seconds timeout
  // }

  // Add this method to your component class
  // setSpinnerTimeout(): void {
  //   this.isLoading = true;
  // }

  // Update your onSubmit method with loading state management
  onSubmit(): void {
    this.isLoading = true; // Start loading

    const totalAmount = this.getTotalPrice() * 100; // Razorpay uses paise
    const options: any = {
      key: "rzp_test_pIqGo2X8aqQ6ja",
      amount: totalAmount,
      currency: "INR",
      name: "JetWayz",
      description: "Flight Booking Payment",
      prefill: {
        name: this.passengers[0].firstName + " " + this.passengers[0].lastName,
        email: this.passengers[0].email,
        contact: this.passengers[0].mobile,
      },
      handler: (response: any) => {
        // Keep spinner active during backend processing
        const bookingPayload = {
          paymentId: response.razorpay_payment_id,
          passenger: this.passengers[0],
          flightId: this.selectedFlight.flightNumber,
          amount: totalAmount / 100,
          count: this.passengerCount,
        };

        const ticketPayload = {
          paymentId: response.razorpay_payment_id,
          passengers: this.passengers,
          flight: this.selectedFlight,
          amount: totalAmount / 100,
        };

        this.service.createBooking(bookingPayload).subscribe(
          (res) => {
            this.isLoading = false;
            const bookingReference = res.message || "N/A";
            // First hide spinner after booking creation completes
            // this.isLoading = false;

            Swal.fire({
              title: "Success!",
              text: `Booking Reference: ${bookingReference}`,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              // Show spinner right before ticket generation starts
              this.isLoading = true;
              this.service.generatePdfOfTicket(ticketPayload).subscribe(
                (res2) => {
                  // Hide spinner when ticket generation completes
                  this.isLoading = false;
                  Swal.fire({
                    title: "Ticket Generated!",
                    text: res2.message || "Your ticket has been sent!",
                    icon: "success",
                    confirmButtonText: "OK",
                  }).then(() => {
                    this.router.navigate(["/"]);
                  });
                },
                (error) => {
                  // Hide spinner on error during ticket generation
                  this.isLoading = false;
                  let errorMsg = error.message || error.error.message;

                  if (errorMsg == null)
                    errorMsg = "Ticket generation failed. Try again.";

                  Swal.fire({
                    title: "Error",
                    text: errorMsg,
                    icon: "error",
                    confirmButtonText: "OK",
                  });
                }
              );
            });
          },
          (error) => {
            // Hide spinner on error during booking creation
            this.isLoading = false;
            let errorMessage =
              "Something went wrong during payment verification.";
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            Swal.fire({
              title: "Payment Failed",
              text: errorMessage,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        );
      },
      
      theme: {
        color: "#0062cc",
      },
      modal: {
        ondismiss: () => {
          this.isLoading = false; // Hide spinner if payment modal is dismissed
        },
      },
    };

    const rzp1 = new Razorpay(options);

    try {
      rzp1.on("ready", () => {
        this.isLoading = false; // Hide spinner when Razorpay popup opens
      });

      rzp1.open();
    } catch (error) {
      this.isLoading = false; // Hide spinner on error

      Swal.fire({
        title: "Error",
        text: "Unable to open Razorpay. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  // onSubmit(): void {
  //   const totalAmount = this.getTotalPrice() * 100; // Razorpay accepts paise

  //   const options: any = {
  //     key: "rzp_test_pIqGo2X8aqQ6ja",
  //     amount: totalAmount,
  //     currency: "INR",
  //     name: "JetWayz",
  //     description: "Flight Booking Payment",
  //     handler: (response: any) => {
  //       // Send response to Spring Boot to verify + handle ticket
  //       const bookingPayload = {
  //         paymentId: response.razorpay_payment_id,
  //         passenger: this.passengers[0],
  //         flightId: this.selectedFlight.id,
  //         amount: totalAmount / 100,
  //       };

  //       const ticketPayload = {
  //         paymentId: response.razorpay_payment_id,
  //         passenger: this.passengers,
  //         flightId: this.selectedFlight,
  //         amount: totalAmount / 100,
  //       };

  //       // Send the payment details to the backend for verification and further processing
  //       this.service.verifyPayment(bookingPayload).subscribe(
  //         (paymentStatusResponse) => {
  //           // Check if the payment is successful based on the backend response
  //           if (paymentStatusResponse.status === "success") {
  //             // If successful, proceed with booking and ticket generation
  //             this.service.createBooking(bookingPayload).subscribe(
  //               (bookingResponse) => {
  //                 // Assuming the response contains a booking reference or any important info:
  //                 const bookingReference = bookingResponse.message || "N/A";

  //                 Swal.fire({
  //                   title: "Success!",
  //                   text: `Booking Reference: ${bookingReference}`,
  //                   icon: "success",
  //                   confirmButtonText: "OK",
  //                 }).then(() => {
  //                   // You can call getBookingById() here after success if needed
  //                   this.service.generatePdfOfTicket(ticketPayload).subscribe(
  //                     (pdfResponse) => {
  //                       // Assuming the response contains a booking reference or any important info:
  //                       const message = pdfResponse.message || "N/A";

  //                       Swal.fire({
  //                         title: "Success!",
  //                         text: message,
  //                         icon: "success",
  //                         confirmButtonText: "OK",
  //                       });
  //                     },
  //                     (pdfError) => {
  //                       let errorMessage =
  //                         "Something went wrong while generating the ticket. Try again.";

  //                       // Handle specific error responses
  //                       if (pdfError.error && pdfError.error.message) {
  //                         errorMessage = pdfError.error.message;
  //                       }

  //                       Swal.fire({
  //                         title: "Error",
  //                         text: errorMessage,
  //                         icon: "error",
  //                         confirmButtonText: "OK",
  //                       });
  //                     }
  //                   );
  //                 });
  //               },
  //               (bookingError) => {
  //                 let errorMessage = "Something went wrong. Try again.";

  //                 // Handle specific error responses
  //                 if (bookingError.error && bookingError.error.message) {
  //                   errorMessage = bookingError.error.message;
  //                 }

  //                 Swal.fire({
  //                   title: "Error",
  //                   text: errorMessage,
  //                   icon: "error",
  //                   confirmButtonText: "OK",
  //                 });
  //               }
  //             );
  //           } else {
  //             Swal.fire({
  //               title: "Payment Failed",
  //               text: "Your payment was not successful. Please try again.",
  //               icon: "error",
  //               confirmButtonText: "OK",
  //             });
  //           }
  //         },
  //         (error) => {
  //           let errorMessage =
  //             "Something went wrong. Please check your payment details and try again.";

  //           // Handle specific error responses from your backend
  //           if (error.error && error.error.message) {
  //             errorMessage = error.error.message;
  //           }

  //           Swal.fire({
  //             title: "Error",
  //             text: errorMessage,
  //             icon: "error",
  //             confirmButtonText: "OK",
  //           });
  //         }
  //       );
  //     },
  //     prefill: {
  //       name: this.passengers[0].firstName + " " + this.passengers[0].lastName,
  //       email: this.passengers[0].email,
  //       contact: this.passengers[0].mobile,
  //     },
  //     theme: {
  //       color: "#0d6efd",
  //     },
  //   };

  //   // Call Razorpay checkout
  //   const rzp1 = new Razorpay(options);
  //   rzp1.open();
  // }

  // Focus event handler
  handleFocus(): void {
    this.isCountryInputFocused = true;
  }

  // Blur event handler
  handleBlur(): void {
    this.isCountryInputFocused = false;
  }

  getAirportName(airportCode: string): string {
    const airportNames: { [key: string]: string } = {
      Ahmedabad: "AMD",
      Bangalore: "BLR",
      Chennai: "MAA",
      Delhi: "DEL",
      Hyderabad: "HYD",
      Kolkata: "CCU",
      Mumbai: "BOM",
      Pune: "PNQ",
      Jaipur: "JAI",
      Kochi: "COK",
      Lucknow: "LKO",
      Chandigarh: "IXC",
      Surat: "STV",
      Goa: "GOI",
      Indore: "IDR",
      Bhopal: "BHO",
      Vishakhapatnam: "VTZ",
      Mangalore: "IXE",
      Madurai: "IXM",
      Varanasi: "VNS",
      Patna: "PAT",
      Agra: "AGR",
      Bhubaneswar: "BBI",
      Tiruchirappalli: "TRZ",
      Imphal: "IMF",
      Manali: "MJL",
      Gorakhpur: "GOP",
      Ranchi: "IXR",
      Jodhpur: "JDR",
      Jabalpur: "JLR",
      Aurangabad: "IXU",
      Dehradun: "DED",
      Guwahati: "GAU",
      Raipur: "RPR",
      Vadodara: "BDQ",
      Nagpur: "NAG",
      Gaya: "GAY",
      Udaipur: "UDR",
      Leh: "IXL",
      Dibrugarh: "DBR",
      Silchar: "IXS",
      Agartala: "IXA",
      Belagavi: "IXG",
      Hubli: "HBX",
      Jamshedpur: "IXJ",
      Kanpur: "KNU",
      Nagaland: "DIM",
      Port_Blair: "IXZ",
      Visakhapatnam: "VTZ",
      Raigarh: "RIG",
      Bagdogra: "IXB",
      Jammu: "IXJ",
      Srinagar: "SXR",
      Kullu: "KUU",
      Andaman: "IXZ",
      Kolhapur: "KLH",
      Kannur: "CNN",
      Mysuru: "MYQ",
      New_Delhi: "DEL",
      Dubai: "DXB",
      Singapore: "SIN",
      Bengaluru: "BEN",
      // Add more airports as needed
    };

    return airportNames[airportCode] || airportCode;
  }

  formatDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} hrs ${minutes} mins`;
  }
}
