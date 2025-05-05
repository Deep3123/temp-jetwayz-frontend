import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
// import { appConfig } from './app.config';

// Server-specific providers
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

// Export the merged config
export const config = mergeApplicationConfig(appConfig, serverConfig);