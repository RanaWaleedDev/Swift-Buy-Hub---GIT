import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoriesall',
  templateUrl: './categoriesall.component.html',
  styleUrls: ['./categoriesall.component.css']
})
export class CategoriesallComponent implements OnInit {
  categoryName: string = 'Cars';
  categoryData: any[] = [];
  filteredList: any[] = [];
  searchQuery: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiConfigServiceService,private router: Router) {}
  
  ngOnInit(): void {
    // Load category data when the component initializes
    this.loadCategoryData();
  }
  
  search(): void {
    // Filter category data based on search query
    this.filterCategoryData();
  }

  // Filter category data based on the search query
  filterCategoryData(): void {
    if (this.searchQuery.trim() !== '') {
      // Filter category data based on the search query
      this.filteredList = this.categoryData.filter((item) =>
        (item.Company && item.Company.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (item.Vaarient && item.Vaarient.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (item.company && item.company.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (item.typeName && item.typeName.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );

      console.log(this.filteredList,'filteredList')
    } else {
      // If search query is empty, load all category data
      this.filteredList = [...this.categoryData];
    }
  }


  
  updateCategory(category: string): void {
    this.categoryName = category;
    this.loadCategoryData();
  }

loadCategoryData(): void {
    this.apiService.getAllDataByCategory(this.categoryName).subscribe(
        (data: any[]) => {
            this.categoryData = data;
            this.filteredList=data
            console.log(data, 'data');
        },
        (error) => {
            console.error('Error loading category data:', error);
        }
    );
}

  // loadCategoryData(): void {
  //   this.apiService.getAllDataByCategory(this.categoryName).subscribe(
  //     (data: any[]) => {
  //       this.categoryData = data;
  //       console.log(data,'data')
  //     },
  //     (error) => {
  //       console.error('Error loading category data:', error);
  //     }
  //   );
  // }

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
