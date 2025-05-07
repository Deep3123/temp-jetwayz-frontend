import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth-service.service";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import Swal from "sweetalert2";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  const token = authService.getToken();
  const role = authService.getRole();

  if (!token) {
    if (isPlatformBrowser(platformId)) {
      Swal.fire({
        icon: "error",
        title: "Please Login!",
        text: "You need to log in first to access this resource.",
        confirmButtonText: "Back to Login",
      });
    }
    // Immediately redirect
    return router.parseUrl("/login");
  }

  if (route.data["role"] && route.data["role"] !== role) {
    if (isPlatformBrowser(platformId)) {
      Swal.fire({
        icon: "error",
        title: "Access Denied!",
        text: "You do not have permission to access this resource.",
        confirmButtonText: "Back to Home",
      });
    }
    return router.parseUrl("/");
  }

  return true;
};
