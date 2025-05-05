import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth-service.service"; // Correct the path if needed
import Swal from "sweetalert2";
import { inject } from "@angular/core"; // Corrected import for 'inject'

// Define the guard function
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // Inject AuthService and Router using the inject function from @angular/core
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const role = authService.getRole();

  // Check if the token exists
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Please Login!",
      text: "You need to log in first to access this resource.",
      confirmButtonText: "Back to Login",
    }).then(() => {
      // Navigate to login after showing the alert
      router.navigate(["/login"]);
    });
    return false; // Prevent navigation
  }

  // Check if the role matches the required role for the route
  if (route.data["role"] && route.data["role"] !== role) {
    Swal.fire({
      icon: "error",
      title: "Access Denied!",
      text: "You do not have permission to access this resource.",
      confirmButtonText: "Back to Home",
    }).then(() => {
      // Redirect to home or any other page
      router.navigate(["/"]);
    });
    return false; // Prevent navigation
  }

  // If both token and role are correct, allow the navigation
  return true;
};
