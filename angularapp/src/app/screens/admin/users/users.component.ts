import { Component, OnInit } from '@angular/core';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { MatDialog } from '@angular/material/dialog'; // Add this import statement
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private apiService: ApiConfigServiceService, private dialog: MatDialog) {} // Ensure MatDialog is injected

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.apiService.getAllUsers().subscribe(
      (data: any[]) => {
        // Format createdAt dates before assigning to users array
        this.users = data.map(user => {
          return {
            ...user,
            createdAt: this.formatDate(user.createdAt)
          };
        });

      },
      (error) => {
        console.error('Error fetching users:', error);
        // Handle error here
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}


generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

getInitialLetter(name: string): string {
  return name ? name[0].toUpperCase() : '';
}


openAddUserDialog(): void {
  const dialogRef = this.dialog.open(AddUserDialogComponent, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    // Handle dialog close
    if (result === 'success') {
      // Refresh user list or perform any necessary action
      this.fetchUsers();
    }
  });
}



downloadCSV(): void {
  // Convert data to CSV format
  const csvData = this.convertToCSV(this.users);

  // Create Blob
  const blob = new Blob([csvData], { type: 'text/csv' });

  // Create URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'users.csv');

  // Click the link to trigger download
  link.click();
}

convertToCSV(data: any[]): string {
  const header = Object.keys(data[0]).join(',');
  const csv = data.map(row => Object.values(row).join(',')).join('\n');
  return `${header}\n${csv}`;
}

}
