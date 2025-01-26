import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  loading: boolean = false;
    showDialog: boolean = false;

  openDialog() {
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  constructor(private http: HttpClient,private apiConfigService: ApiConfigServiceService
    ,private snackBar: MatSnackBar) {}

  sendSubscriptionEmail(subscriptionType: string) {
    this.loading = true; // Show loading indicator

    const userDataString = localStorage.getItem('userData');
  
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userEmail = userData.username;
      const emailData = { subscriptionType, userEmail }; // Use the provided subscriptionType
      this.apiConfigService.sendEmail(emailData).subscribe(
        (response) => {
          console.log('Response:', response);
          if (response && response.message === 'Email sent successfully') {
            console.log('Email sent successfully');
            this.showSuccessMessage();
            this.loading = false; // Hide loading indicator

            // Optionally display a confirmation message to the user
          } else {
            console.error('Unexpected response:', response);
            this.loading = false; // Hide loading indicator

            // Handle unexpected responses
          }
        },
        (error) => {
          console.error('Error sending email', error);
          this.loading = false; // Hide loading indicator

          // Handle error scenarios (e.g., display an error message)
        }
      );
    }
  }

  showSuccessMessage() {
    this.snackBar.open('Plan Subscribed successfully. Check your email', 'Close', {
      duration: 2000, // Duration in milliseconds
      panelClass: ['success-snackbar'] // Optional custom CSS class for styling
    });
  }
  
  
  
}
