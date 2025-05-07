import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements AfterViewInit {
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Modal initialization
      const modals = document.querySelectorAll('.modal');
      if ((window as any).bootstrap) {
        modals.forEach(modal => {
          new (window as any).bootstrap.Modal(modal);
        });
      }

      // Handle modal link clicks
      document.querySelectorAll('[data-bs-toggle="modal"]').forEach(element => {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          const targetAttr = element.getAttribute('data-bs-target');
          const targetModal = targetAttr ? document.querySelector(targetAttr) : null;
          if (targetModal && (window as any).bootstrap) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(targetModal)
              || new (window as any).bootstrap.Modal(targetModal);
            modalInstance.show();
          }
        });
      });

      // Smooth scrolling for standard anchors
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          if (!anchor.hasAttribute('data-bs-toggle')) {
            e.preventDefault();
            const targetId = anchor.getAttribute('href')!.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });

      // Smooth scroll for routerLinks with fragment
      document.querySelectorAll('a[routerLink], [routerLink]').forEach(routerLink => {
        routerLink.addEventListener('click', () => {
          document.body.classList.add('smooth-scroll');
          const fragment = routerLink.getAttribute('fragment');
          if (fragment) {
            setTimeout(() => {
              const targetElement = document.getElementById(fragment);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 300);
          }
        });
      });
    }
  }
}
