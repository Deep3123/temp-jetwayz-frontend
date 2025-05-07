import { APP_BASE_HREF } from "@angular/common";
import { renderModule } from "@angular/platform-server";
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { AppServerModule } from "./app/app.module.server";

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, "../browser");
  const indexHtml = join(browserDistFolder, "index.html");

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
      extraProviders: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl || "/" },
      ],
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

// Add a default export at the end of the file
export default app; // Export the app function as the default export
