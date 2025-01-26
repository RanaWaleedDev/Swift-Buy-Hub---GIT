import { Component, HostBinding, Renderer2, OnInit } from '@angular/core';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  email: string = '';
  subscriptionSuccess: boolean = false;
  subscriptionError: boolean = false;
  loading: boolean = false; // Loading flag
  
  @HostBinding('class.dark-theme') isDarkTheme: boolean = false;

  constructor(private apiConfigService: ApiConfigServiceService,private renderer: Renderer2) {}

  ngOnInit(): void {
    // Check if the dark theme class is initially present
    this.isDarkTheme = document.body.classList.contains('dark-theme');

    // Listen for changes to the dark theme class
    this.renderer.listen('body', 'DOMSubtreeModified', () => {
      this.isDarkTheme = document.body.classList.contains('dark-theme');
    });
  }


  subscribe(): void {
    console.log('subscription started', this.email);

    // Check if the email input is empty
    if (!this.email.trim()) {
      // Show message to check email
      this.subscriptionError = true;
      return;
    }

    // Set loading to true when request is initiated
    this.loading = true;

    // Call the backend API to subscribe the user
    this.apiConfigService.subscribeToNewsletter(this.email).subscribe(
      (response) => {
        console.log('Subscription successful:', response);
        // Display success message to the user
        this.subscriptionSuccess = true;
        // Clear the email input after subscribing
        this.email = '';
      },
      (error) => {
        console.error('Error subscribing to newsletter:', error);
        // Display error message to the user
        this.subscriptionError = true;
      }
    ).add(() => {
      // Set loading to false when request completes
      this.loading = false;
    });
  }

  // Method to hide success and error messages
  hideMessages(): void {
    this.subscriptionSuccess = false;
    this.subscriptionError = false;
  }
}
