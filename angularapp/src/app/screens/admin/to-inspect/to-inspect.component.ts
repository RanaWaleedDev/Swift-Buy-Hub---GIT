import { Component, OnInit } from '@angular/core';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-to-inspect',
  templateUrl: './to-inspect.component.html',
  styleUrls: ['./to-inspect.component.css']
})
export class ToInspectComponent implements OnInit {
  smartInspections: any[] = [];

  constructor(private apiConfigService: ApiConfigServiceService,private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSmartInspections();
  }

  fetchSmartInspections(): void {
    this.apiConfigService.getSmartInspections().subscribe((data: any) => {
      this.smartInspections = data;
      console.log(data,'datadata')
    });
  }


  navigateToCategoryView(categoryId: string) {
    this.http.get<any>(`http://localhost:3000/getCategoryViewRoute/${categoryId}`).subscribe(
      (response) => {
        if (response.route) {
          console.log(response.route,'response.route')
          this.router.navigate([response.route]);
        } else {
          console.error('Route not found');
          // Handle route not found
        }
      },
      (error) => {
        console.error('Error occurred:', error);
        // Handle error
      }
    );
  }

  deleteSmartInspection(index: number): void {
    const inspectionId = this.smartInspections[index]._id;
    console.log(inspectionId,'inspectionId');
    this.apiConfigService.deleteSmartInspection(inspectionId).subscribe(() => {
      console.log('deleted successful');
      // Remove the deleted item from the smartInspections array
      this.smartInspections.splice(index, 1);
    });
  }
  

}
