import { Component, HostBinding, Renderer2, OnInit } from '@angular/core';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('typing', [
      transition('* => *', [
        animate('3000ms', style({ width: '0' })),
        animate('3000ms', style({ width: '*' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  cars: any[] | undefined;
  laptops: any[] | undefined;
  isDarkMode: boolean = false; // Define isDarkMode property
  typingState: string = 'start';
  showDialog = false;
  isAdmin: boolean = false; // Variable to store whether the user is an admin

  isLoggedIn(): boolean {
    return !localStorage.getItem('userData');
  }
  
  openDialog(): void {
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  @HostBinding('class.dark-theme') isDarkTheme: boolean = false;

  constructor(private apiService: ApiConfigServiceService,private router: Router, private renderer: Renderer2) {}


  ngOnInit(): void {
    this.getAllCars();
    this.getAllLaptops();

    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.isAdmin = userData.role === 'admin'; // Assuming the role is 'admin'
    }

    this.isDarkTheme = document.body.classList.contains('dark-theme');

    // Listen for changes to the dark theme class
    this.renderer.listen('body', 'DOMSubtreeModified', () => {
      this.isDarkTheme = document.body.classList.contains('dark-theme');
    });

  }
 

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.muted = true;
    }
  }

  restartVideo(video: HTMLVideoElement) {
    video.currentTime = 0;
    video.play();
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  viewItem(categoryName: string, carId: string) {
    // Navigate to the specified path with category name and car ID as parameters
    this.router.navigate(['/category/view', categoryName, carId]);
  }

  getAllCars(): void {
    this.apiService.getAllCars()
      .subscribe(data => {
        this.cars = data;
        console.log(data)
      });
  }

  getAllLaptops(): void {
    this.apiService.getAllLaptops()
      .subscribe(data => {
        this.laptops = data;
        console.log(data)

      });
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
  

}
