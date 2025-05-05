import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { authGuard } from "./services/auth.guard";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { FlightPageComponent } from "./flight-page/flight-page.component";
import { ContactComponent } from "./contact/contact.component";
import { HomeComponent } from "./home/home.component";
import { FlightBookingComponent } from "./flight-booking/flight-booking.component";
import { ContactUsPageComponent } from "./contact-us-page/contact-us-page.component";
import { FlightResultsComponent } from "./flight-results/flight-results.component";
import { BookingDetailsComponent } from "./booking-details/booking-details.component";
import { BookingManagementComponent } from "./booking-management/booking-management.component";
import { OAuthProfileCompletionComponent } from "./oauth-profile-completion/oauth-profile-completion.component";

// const routerOptions: ExtraOptions = {
//   scrollPositionRestoration: "enabled",
//   anchorScrolling: "enabled",
//   scrollOffset: [0, 64], // [x, y] - adjust the y-offset based on your header height
//   onSameUrlNavigation: "reload",
// };

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  {
    path: "reset-password/:username/:timestamp/:token",
    component: ResetPasswordComponent,
  },
  {
    path: "admin",
    component: AdminPageComponent,
    canActivate: [authGuard], // Apply the guard to this route
    data: { role: "ADMIN" }, // Specify that the user should be an ADMIN
  },
  {
    path: "flight",
    component: FlightPageComponent,
    canActivate: [authGuard], // Apply the guard to this route
    data: { role: "ADMIN" }, // Specify that the user should be an ADMIN
  },
  {
    path: "contact-data",
    component: ContactUsPageComponent,
    canActivate: [authGuard], // Apply the guard to this route
    data: { role: "ADMIN" }, // Specify that the user should be an ADMIN
  },
  {
    path: "all-bookings-data",
    component: BookingManagementComponent,
    canActivate: [authGuard],
    data: { role: "ADMIN" },
  },
  { path: "contact-us", component: ContactComponent, canActivate: [authGuard] },
  {
    path: "flight-booking",
    component: FlightBookingComponent,
    canActivate: [authGuard],
  },
  {
    path: "flight-result",
    component: FlightResultsComponent,
    canActivate: [authGuard],
  },
  {
    path: "booking-details",
    component: BookingDetailsComponent,
    canActivate: [authGuard],
  },
  { path: "oauth-callback", component: ErrorPageComponent }, // Just to handle the token, will redirect as needed
  { path: "complete-profile", component: OAuthProfileCompletionComponent },
  { path: "", component: HomeComponent },
  { path: "**", component: ErrorPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
      onSameUrlNavigation: "reload",
      scrollOffset: [0, 64],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
