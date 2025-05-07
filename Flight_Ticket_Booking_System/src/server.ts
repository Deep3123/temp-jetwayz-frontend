// import {
//   AngularNodeAppEngine,
//   createNodeRequestHandler,
//   isMainModule,
//   writeResponseToNodeResponse,
// } from '@angular/ssr/node';
// import express from 'express';
// import { dirname, resolve } from 'node:path';
// import { fileURLToPath } from 'node:url';

// const serverDistFolder = dirname(fileURLToPath(import.meta.url));
// const browserDistFolder = resolve(serverDistFolder, '../browser');

// const app = express();
// const angularApp = new AngularNodeAppEngine();

// /**
//  * Example Express Rest API endpoints can be defined here.
//  * Uncomment and define endpoints as necessary.
//  *
//  * Example:
//  * ```ts
//  * app.get('/api/**', (req, res) => {
//  *   // Handle API request
//  * });
//  * ```
//  */

// /**
//  * Serve static files from /browser
//  */
// app.use(
//   express.static(browserDistFolder, {
//     maxAge: '1y',
//     index: false,
//     redirect: false,
//   }),
// );

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.use('/**', (req, res, next) => {
//   angularApp
//     .handle(req)
//     .then((response) =>
//       response ? writeResponseToNodeResponse(response, res) : next(),
//     )
//     .catch(next);
// });

// /**
//  * Start the server if this module is the main entry point.
//  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
//  */
// if (isMainModule(import.meta.url)) {
//   const port = process.env['PORT'] || 4000;
//   app.listen(port, () => {
//     console.log(`Node Express server listening on http://localhost:${port}`);
//   });
// }

// /**
//  * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
//  */
// export const reqHandler = createNodeRequestHandler(app);

// import {
//   AngularNodeAppEngine,
//   createNodeRequestHandler,
//   isMainModule,
//   writeResponseToNodeResponse,
// } from "@angular/ssr/node";
// import express from "express";
// import { dirname, resolve, join } from "node:path";
// import { fileURLToPath } from "node:url";

// const serverDistFolder = dirname(fileURLToPath(import.meta.url));
// const browserDistFolder = resolve(serverDistFolder, "../browser");
// const indexHtml = join(browserDistFolder, "index.html");

// const app = express();
// const angularApp = new AngularNodeAppEngine();

// /**
//  * Example Express Rest API endpoints can be defined here.
//  * Uncomment and define endpoints as necessary.
//  *
//  * Example:
//  * ```ts
//  * app.get('/api/**', (req, res) => {
//  *   // Handle API request
//  * });
//  * ```
//  */

// /**
//  * Serve static files from /browser
//  */
// app.use(
//   express.static(browserDistFolder, {
//     maxAge: "1y",
//     index: false,
//     redirect: false,
//   })
// );

// /**
//  * Define routes that should bypass SSR (browser-only routes)
//  * These routes typically use browser-specific APIs and fail during prerendering
//  */
// const browserOnlyRoutes = [
//   "/flight-result",
//   "/booking-details",
//   "/all-bookings-data",
//   "/register",
//   "/oauth-callback",
//   "/complete-profile"
// ];

// app.get(browserOnlyRoutes, (req, res) => {
//   // Send the index.html for browser-only routes
//   res.sendFile(indexHtml);
// });

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.use("/**", (req, res, next) => {
//   angularApp
//     .handle(req)
//     .then((response) =>
//       response ? writeResponseToNodeResponse(response, res) : next()
//     )
//     .catch((err) => {
//       console.error("SSR Error:", err);
//       // Fallback to client-side rendering on SSR errors
//       res.sendFile(indexHtml);
//     });
// });

// /**
//  * Start the server if this module is the main entry point.
//  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
//  */
// if (isMainModule(import.meta.url)) {
//   const port = process.env["PORT"] || 4000;
//   app.listen(port, () => {
//     console.log(`Node Express server listening on http://localhost:${port}`);
//   });
// }

// /**
//  * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
//  */
// export const reqHandler = createNodeRequestHandler(app);

import { APP_BASE_HREF } from "@angular/common";
import { renderModule } from "@angular/platform-server"; // Updated import
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { AppServerModule } from "./app/app.module.server";
// import { AppServerModule } from './main.server'; // Import the AppServerModule

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, "../browser");
  const indexHtml = join(browserDistFolder, "index.html");

  // Routes that should not use SSR (these will be served as static files)
  const browserOnlyRoutes = [
    "/flight-result",
    "/booking-details",
    "/all-bookings-data",
    "/register",
    "/oauth-callback",
    "/complete-profile",
  ];

  server.set("view engine", "html");
  server.set("views", browserDistFolder);

  // Serve static files from /browser
  server.use(
    express.static(browserDistFolder, {
      maxAge: "1y",
      index: false,
    })
  );

  // For browser-only routes, skip SSR
  server.get(browserOnlyRoutes, (req, res) => {
    res.sendFile(indexHtml);
  });

  // All regular routes use Angular SSR
  server.get("*", (req, res, next) => {
    // Skip SSR if the URL includes query parameters that require client-side processing
    if (
      req.url.includes("token=") ||
      req.url.includes("requiresProfileCompletion=")
    ) {
      res.sendFile(indexHtml);
      return;
    }

    const { protocol, originalUrl, baseUrl, headers } = req;

    renderModule(AppServerModule, {
      // Pass the AppServerModule class
      document: indexHtml, // Path to your index.html file
      url: `${protocol}://${headers.host}${originalUrl}`,
      extraProviders: [{ provide: APP_BASE_HREF, useValue: req.baseUrl || '/' }],
    })
      .then((html: string) => res.send(html))
      .catch((err: any) => {
        console.error("Error rendering route:", err);
        // Fallback to serving the index file
        res.sendFile(indexHtml);
      });
  });

  return server;
}

function run(): void {
  const port = process.env["PORT"] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// If we're not being imported by another module, run the server directly
const maybeEvent = (globalThis as any).Deno?.event;
if (
  import.meta.url === (globalThis as any).location?.href ||
  maybeEvent === "unload"
) {
  run();
}

// Export the Express app as a request handler
export const reqHandler = app();
