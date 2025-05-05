import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-error-page",
  standalone: false,
  templateUrl: "./error-page.component.html",
  styleUrls: ["./error-page.component.css"],
})
export class ErrorPageComponent implements OnInit {
  ngOnInit(): void {
    this.loadLottieAnimation();
  }

  loadLottieAnimation() {
    // Wait for the window object to be available
    if (typeof window !== "undefined") {
      const lottie = (window as any).lottie; // Access Lottie from window object

      lottie.loadAnimation({
        container: document.querySelector(".lottie-animation"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "https://lottie.host/d987597c-7676-4424-8817-7fca6dc1a33e/BVrFXsaeui.json",
      });
    }
  }
}
