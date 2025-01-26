import { Component, OnInit } from '@angular/core';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
interface Subscription {
  _id: string;
  email: string;
  subscriptionType: string;
  subscriptionTime: Date;
  status: string;
}


@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Subscription[] = [];

  constructor(private apiConfigService: ApiConfigServiceService) { }

  ngOnInit(): void {
    this.fetchSubscriptions();
  }

  fetchSubscriptions(): void {
    this.apiConfigService.getSubscriptions().subscribe(
      (subscriptions: Subscription[]) => {
        this.subscriptions = subscriptions;
        console.log(this.subscriptions ,'this.subscriptions ')
      },
      (error) => {
        console.error('Error fetching subscriptions:', error);
        // Handle error scenarios (e.g., display an error message)
      }
    );
  }

  getAmount(subscriptionType: string): number {
    return subscriptionType === 'Team' ? 79.00 : (subscriptionType === 'Personal' ? 50.00 : 0);
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'canceled':
        return 'Canceled';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'rounded-full bg-blue-600 py-2 px-3 text-xs text-white';
      case 'canceled':
        return 'rounded-full bg-red-200 py-1 px-2 text-red-500';
      case 'pending':
        return 'rounded-full bg-blue-200 py-1 px-2 text-blue-500';
      default:
        return '';
    }
  }

  updateStatus(subscription: Subscription): void {
    const newStatus = subscription.status === 'active' ? 'canceled' : 'active';
    const subscriptionId = subscription._id; // Use _id instead of id
  console.log(subscription._id,'subscription._id')
    this.apiConfigService.updateSubscriptionStatus(subscription._id, newStatus).subscribe(
      (response) => {
        subscription.status = newStatus;
        console.log('Status updated successfully:', response);
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }
  
  
  convertToCSV(subscriptions: Subscription[]): string {
    const header = ['Invoice', 'Date Subscription', 'Amount', 'Status', 'Email'];
    const rows = subscriptions.map(subscription => {
      const subscriptionTime = subscription.subscriptionTime instanceof Date ? subscription.subscriptionTime.toDateString() : '';
      return [
        `${subscription.subscriptionType} - ${subscriptionTime}`,
        subscription.subscriptionTime instanceof Date ? subscription.subscriptionTime.toISOString() : '', // Adjust format as required
        this.getAmount(subscription.subscriptionType).toString(),
        this.getStatusText(subscription.status),
        subscription.email
      ];
    });
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
  }


  // Method to trigger the download of the CSV file
  downloadCSV(csvContent: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscriptions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Method to export subscription data to CSV when the button is clicked
  exportToCSV(): void {
    const csvContent = this.convertToCSV(this.subscriptions);
    this.downloadCSV(csvContent);
  }
}