import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryName: string = '';
  categoryData: any[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiConfigServiceService,private router: Router) {}

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('name') || '';
    this.loadCategoryData();
  }

  loadCategoryData(): void {
    this.apiService.getAllDataByCategory(this.categoryName).subscribe(
      (data: any[]) => {
        this.categoryData = data;
        console.log(data,'data')
      },
      (error) => {
        console.error('Error loading category data:', error);
      }
    );
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
  truncateTitle(company: string, variant: string): string {
    const combinedTitle = `${company} ${variant}`;
    const maxLength = 30;
    if (combinedTitle.length <= maxLength) {
      return combinedTitle;
    }
    return combinedTitle.slice(0, maxLength) + '...';
  }


  viewItem(categoryName: string, carId: string) {
    // Navigate to the specified path with category name and car ID as parameters
    this.router.navigate(['/category/view', categoryName, carId]);
  }
}
