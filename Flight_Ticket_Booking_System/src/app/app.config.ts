import {
  ApplicationConfig,
  CUSTOM_ELEMENTS_SCHEMA,
  importProvidersFrom,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app-routing.module";
import {
  provideClientHydration,
  withEventReplay,
  BrowserModule,
} from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  provideHttpClient,
  withInterceptors,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { AuthInterceptor } from "./core/interceptors/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Material Modules
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";

// Third-party modules
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { environment } from "../environments/environment";

// Replaced BrowserModule with CommonModule for SSR
import { CommonModule } from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.encryption.googleClientId,
              {
                oneTapEnabled: false,
              }
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    importProvidersFrom(
      CommonModule, // Use CommonModule for SSR
      FormsModule,
      ReactiveFormsModule,
      // Material modules
      MatCardModule,
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatProgressSpinnerModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatTooltipModule,
      // Third-party modules
      NgxMaterialTimepickerModule,
      SocialLoginModule
    ),
  ],
};
