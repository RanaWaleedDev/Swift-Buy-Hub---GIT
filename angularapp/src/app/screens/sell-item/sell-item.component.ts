import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostAddComponent } from '../post-add/post-add.component';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';

@Component({
  selector: 'app-sell-item',
  templateUrl: './sell-item.component.html',
  styleUrls: ['./sell-item.component.css']
})
export class SellItemComponent implements OnInit {
  userId: string | undefined;
  cars: any[] = [];
  laptops: any[] = [];
  
  constructor(public dialog: MatDialog, private apiService: ApiConfigServiceService) {}

   ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.userId = userData.userId;
      // Fetch cars and laptops for the user
      this.fetchCars();
      this.fetchLaptops();
    } else {
      console.error('User data not found in local storage');
    }
  }

  fetchCars(): void {
    if (this.userId) {
      this.apiService.getCarsByUserId(this.userId).subscribe(
        (response) => {
          this.cars = response;
          console.log(response,'cars')
        },
        (error) => {
          console.error('Error fetching cars:', error);
        }
      );
    }
  }

  fetchLaptops(): void {
    if (this.userId) {
      this.apiService.getLaptopsByUserId(this.userId).subscribe(
        (response) => {
          this.laptops = response;
          console.log(response,'laptops')

        },
        (error) => {
          console.error('Error fetching laptops:', error);
        }
      );
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PostAddComponent, {
      minWidth:'800px',
      // width: '500px', // Adjust the width as needed
      disableClose: true, // Prevent closing by clicking outside the dialog
      minHeight:'500px'

    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchCarsAndLaptops(); 
      // Handle the result if needed
    });
  }

  fetchCarsAndLaptops(): void {
    this.fetchCars();
    this.fetchLaptops();
  }


  truncateDescription(description: string): string {
    const maxLength = 97;
    if (description.length <= maxLength) {
      return description;
    }
    return description.slice(0, maxLength) + '...';
  }

// Assuming 'car' is the object representing a car with an 'images' property containing the filenames of the uploaded images
  getImageUrl(car: any): string {
    if (car.images && car.images.length > 0) {
      return `http://localhost:3000/images/${car.images[0]}`;
    } else {
      return 'path/to/placeholder-image.jpg';
    }
  }


  
  
}
