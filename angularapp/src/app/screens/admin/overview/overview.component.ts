import { Component, OnInit } from '@angular/core';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  cars: any[] | undefined;
  laptops: any[] | undefined;
  users: any[] | undefined; // Array to store users

  constructor(private apiService: ApiConfigServiceService) { }

  ngOnInit(): void {
    this.fetchData();
    this.fetchUsers(); // Call the method to fetch users
  }

  fetchData(): void {
    // Fetch all cars
    this.apiService.getAllCars().subscribe(
      (data: any[]) => {
        this.cars = data;
      },
      (error: any) => { // Explicitly define the type of error as any
        console.error('Error fetching cars:', error);
      }
    );

    // Fetch all laptops
    this.apiService.getAllLaptops().subscribe(
      (data: any[]) => {
        this.laptops = data;
      },
      (error: any) => { // Explicitly define the type of error as any
        console.error('Error fetching laptops:', error);
      }
    );

    // Add more API calls for other data as needed
  }

  fetchUsers(): void {
    // Fetch all users
    this.apiService.getAllUsers().subscribe(
      (data: any[]) => {
        this.users = data;
      },
      (error: any) => { // Explicitly define the type of error as any
        console.error('Error fetching users:', error);
      }
    );
  }
}
