import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server'; // Required for SSR (Server-Side Rendering)
import { AppModule } from './app.module'; // Import AppModule to use the same declarations
import { HttpClientModule } from '@angular/common/http'; // Import HTTP services for SSR if needed
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule, // Import AppModule instead of declaring components again
    ServerModule, // SSR module required
    HttpClientModule, // For HTTP services in SSR
  ],
  bootstrap: [AppComponent], // Bootstrap AppComponent from AppModule
})
export class AppServerModule {}
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}