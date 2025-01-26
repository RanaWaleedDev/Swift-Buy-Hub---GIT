import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  
})
export class ToolbarComponent implements OnInit{
  isAdmin: boolean = false; // Variable to store whether the user is an admin
  isDarkMode: boolean = false;
  currentlocation: string = 'Fetching';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.detectUserLocation();

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      this.isDarkMode = JSON.parse(savedMode);
      this.applyTheme();
    }
    // Check if the user is an admin
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.isAdmin = userData.role === 'admin'; // Assuming the role is 'admin'
    }
  }



  isLoggedIn(): boolean {
    return !localStorage.getItem('userData');
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    // this.applyTheme();
    // Save user preference to local storage
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
    const body = document.body;
  if (this.isDarkMode) {
    body.classList.add('dark-theme');
  } else {
    body.classList.remove('dark-theme');
  }

  }
  applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      document.querySelector('.section1')?.classList.add('dark-theme'); // Add dark theme to section1
    } else {
      document.body.classList.remove('dark-theme');
      document.querySelector('.section1')?.classList.remove('dark-theme'); // Remove dark theme from section1
    }
  }
  

  navigateToNextPage() {
    
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const senderId = userData.userId;
      this.router.navigate(['/chats', senderId]);
    }
    
  }
 
  // Function to navigate to the 'sell' route
  navigateToSell() {
    this.router.navigate(['/sell']); // Replace 'sell' with your actual route
  }

  settingnavigate() {
    this.router.navigate(['/setting/user']); // Replace 'sell' with your actual route
  }


  navigateToLogin() {
    this.router.navigate(['/login']); // Replace 'sell' with your actual route
  }

  navigateToSearchPage() {
    this.router.navigate(['/search']); // Replace 'search' with your actual route
  }
  navigateToSignUp() {
    this.router.navigate(['/sign-up']); // Replace 'search' with your actual route
  }


  navigateToAdminPanel() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const senderId = userData.userId;
      this.router.navigate(['/users/admin', senderId, 'overview']); // Adjust the route as needed
    }
  }


  logout(): void {
    // Clear local storage
    localStorage.clear();
    // Navigate to home page
    this.router.navigate(['/home']);
  }
  

  detectUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.getCityFromCoordinates(latitude, longitude);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  getCityFromCoordinates(latitude: number, longitude: number): void {
    const apiKey = 'AIzaSyDCxfCQPYJNZqbLfGCbTAipz_TMWRlorwA';
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.results && data.results.length > 0) {
          const city = data.results[0].address_components.find((component: any) => component.types.includes('locality'));
          if (city) {
            console.log('User is in:', city.long_name);
            this.currentlocation=city.long_name
            // Here you can perform any action with the user's city, such as displaying it in the UI
          } else {
            console.log('City not found in response');
          }
        } else {
          console.log('No results found in response');
        }
      })
      .catch(error => {
        console.error('Error fetching city:', error);
      });
  }

  
}
