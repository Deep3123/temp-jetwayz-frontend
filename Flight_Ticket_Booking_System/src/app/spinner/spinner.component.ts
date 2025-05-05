// spinner.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: false,
  template: `
    <div class="spinner-overlay" *ngIf="isLoading">
      <div class="spinner-container">
        <div class="spinner"></div>
        <div class="loading-text">
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top: 5px solid #fff;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    .loading-text {
      color: white;
      font-size: 20px;
      font-weight: bold;
      display: flex;
    }

    .loading-text span {
      animation: fadeInOut 1.5s ease-in-out infinite;
      margin-right: 2px;
    }

    .loading-text span:nth-child(2) { animation-delay: 0.1s; }
    .loading-text span:nth-child(3) { animation-delay: 0.2s; }
    .loading-text span:nth-child(4) { animation-delay: 0.3s; }
    .loading-text span:nth-child(5) { animation-delay: 0.4s; }
    .loading-text span:nth-child(6) { animation-delay: 0.5s; }
    .loading-text span:nth-child(7) { animation-delay: 0.6s; }
    .loading-text span:nth-child(8) { animation-delay: 0.7s; }
    .loading-text span:nth-child(9) { animation-delay: 0.8s; }
    .loading-text span:nth-child(10) { animation-delay: 0.9s; }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeInOut {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
  `]
})
export class SpinnerComponent {
  @Input() isLoading: boolean = false;
}