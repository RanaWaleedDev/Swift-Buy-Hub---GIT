import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private router: Router) {}

  navigateToOverview() {
    // Get the current URL and append '/overview' to it
    const currentUrl = this.router.url;
    const overviewUrl = `${currentUrl}/overview`;

    // Navigate to the new URL
    this.router.navigateByUrl(overviewUrl);
  }


  selectedTab: string = 'overview'; // Default selected tab

  selectTab(tab: string) {
    this.selectedTab = tab;
  }



}
