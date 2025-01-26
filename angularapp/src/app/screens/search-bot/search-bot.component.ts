import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bot',
  templateUrl: './search-bot.component.html',
  styleUrls: ['./search-bot.component.css']
})
export class SearchBotComponent {
  query: string='';
  category: string='both';
  carResults: any[] = []; // Array to store search results for cars
  laptopResults: any[] = []; // Array to store search results for laptops
  isAdmin: boolean = false; // Variable to store whether the user is an admin
  isDarkMode: boolean = false;
  searchResultText: string = ''; // Variable to hold search result text

  constructor(private http: HttpClient,private router: Router) {}

  search(): void {
    this.searchResultText=''
    console.log(this.query, 'this.query', this.category, 'this.category');
    // Send HTTP request to backend API to search for cars or laptops based on the query and category
    this.http.get(`http://localhost:3000/search123?q=${this.query}&category=${this.category}`)
      .subscribe((response: any) => {
        this.searchResultText = this.getSearchResultText(this.category, response.results.length);

        // Clear previous results
        this.carResults = [];
        this.laptopResults = [];

        // Iterate over the search results
        for (const result of response.results) {
          // Check the selectedCategory and add the result to the appropriate array
          if (result.selectedCategory === 'cars') {
            this.carResults.push(result);
          } else if (result.selectedCategory === 'laptops') {
            this.laptopResults.push(result);
          }
        }
      }, (error) => {
        console.error('Error searching:', error);
        // Handle error
      });
  }

 // Function to generate search result text based on category and number of results
getSearchResultText(category: string, numberOfResults: number): string {
  let text = '';

  // Generate text based on the selected category
  switch (category) {
      case 'cars':
          text = numberOfResults > 0 ?
              `I've found ${numberOfResults} cars that match your query. Let me show you:` :
              `I couldn't find any cars matching your query. Would you like to refine it?`;
          break;
      case 'laptops':
          text = numberOfResults > 0 ?
              `Great news! I've found ${numberOfResults} laptops that match your query. Here they are:` :
              `Oops! I couldn't find any laptops matching your query. Can I assist you with something else?`;
          break;
      case 'both':
          text = numberOfResults > 0 ?
              `I've found a total of ${numberOfResults} items matching your query. Here they are:` :
              `Sorry, I couldn't find any items matching your query. Would you like to try again?`;
          break;
      default:
          text = `I'm sorry, but I couldn't process your request. Could you please try again?`;
          break;
  }

  return text;
}



  viewItem(categoryName: string, carId: string) {
    // Navigate to the specified path with category name and car ID as parameters
    this.router.navigate(['/category/view', categoryName, carId]);
  }

  getImageUrl(car: any): string {
    if (car.images && car.images.length > 0) {
      // Assuming the images are stored in the '/images' directory on the backend
      return `http://localhost:3000/images/${car.images[0]}`;
    } else {
      // Return a placeholder image URL if no images are available
      return 'path/to/placeholder-image.jpg';
    }
  }

  
  truncateDescription(description: string): string {
    const maxLength = 50;
    if (description.length <= maxLength) {
      return description;
    }
    return description.slice(0, maxLength) + '...';
  }
  truncateCarTitle(company: string, variant: string): string {
    const combinedTitle = `${company} ${variant}`;
    const maxLength = 30;
    if (combinedTitle.length <= maxLength) {
      return combinedTitle;
    }
    return combinedTitle.slice(0, maxLength) + '...';
  }
  

isLoggedIn(): boolean {
    return !localStorage.getItem('userData');
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    // Save user preference to local storage
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
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
}
