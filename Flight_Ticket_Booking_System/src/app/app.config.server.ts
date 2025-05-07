import { mergeApplicationConfig, ApplicationConfig, PLATFORM_ID } from "@angular/core";
import { provideServerRendering } from "@angular/platform-server";
import { appConfig } from "./app.config";
import { isPlatformBrowser } from "@angular/common";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";

// Since `this.platformId` cannot be used in a static context like this, we will use `isPlatformBrowser` inside a factory function.

// Server-specific providers
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: BrowserAnimationsModule,
      useFactory: (platformId: any) => {
        return isPlatformBrowser(platformId)
          ? BrowserAnimationsModule
          : NoopAnimationsModule;
      },
      deps: [PLATFORM_ID],
    },
  ],
};

// Export the merged config
export const config = mergeApplicationConfig(appConfig, serverConfig);
