import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common"; // This utility helps in checking if we are in the browser

@Component({
  selector: "app-error-page",
  standalone: false,
  templateUrl: "./error-page.component.html",
  styleUrls: ["./error-page.component.css"],
})
export class ErrorPageComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Check if we are in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.loadLottieAnimation();
    }
  }

  loadLottieAnimation() {
    // Now safely access window and load the Lottie animation only in the browser
    const lottie = (window as any).lottie; // Access Lottie from window object

    if (lottie) {
      lottie.loadAnimation({
        container: document.querySelector(".lottie-animation"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "https://lottie.host/d987597c-7676-4424-8817-7fca6dc1a33e/BVrFXsaeui.json",
      });
    } else {
      console.error("Lottie animation library is not loaded.");
    }
  }
}
