import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { UserDialogComponent } from "./user-dialog/user-dialog.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { AuthInterceptor } from "./core/interceptors/auth.service";
import { FlightDialogComponent } from './flight-dialog/flight-dialog.component';
import { FlightPageComponent } from './flight-page/flight-page.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { FlightBookingComponent } from './flight-booking/flight-booking.component';
import { ContactUsPageComponent } from './contact-us-page/contact-us-page.component';
import { ContactUsDialogComponent } from './contact-us-dialog/contact-us-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlightResultsComponent } from './flight-results/flight-results.component';
import { TimeFormatPipe } from './time-format.pipe';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { FormatDurationPipe } from './format-duration.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { BookingDetailsDialogComponent } from './booking-details-dialog/booking-details-dialog.component';
import { BookingManagementComponent } from './booking-management/booking-management.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OAuthProfileCompletionComponent } from "./oauth-profile-completion/oauth-profile-completion.component";
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
// import { environment } from "../environments/environment";
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminPageComponent,
    UserDialogComponent,
    ErrorPageComponent,
    FlightDialogComponent,
    FlightPageComponent,
    ContactComponent,
    HomeComponent,
    FlightBookingComponent,
    ContactUsPageComponent,
    ContactUsDialogComponent,
    FlightResultsComponent,
    TimeFormatPipe,
    BookingDetailsComponent,
    FormatDurationPipe,
    SpinnerComponent,
    BookingDetailsDialogComponent,
    BookingManagementComponent,
    OAuthProfileCompletionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SocialLoginModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.encryption.googleClientId,  // 👈 Replace with your actual client ID
              {
                oneTapEnabled: false, // Adjust based on your needs
                // Other options as needed
              }
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
