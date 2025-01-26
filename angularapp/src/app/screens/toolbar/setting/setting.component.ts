import { Component, OnInit } from '@angular/core';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EmailchangeComponent } from './emailchange/emailchange.component';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  userEmail: string | null = null;
  currentPassword: string = '';
  newPassword: string = '';
  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }



  constructor(private apiService: ApiConfigServiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {}




  ngOnInit(): void {
    // Retrieve email from local storage
    const userDataString = localStorage.getItem('userData');
    console.log(userDataString,'userDataString')
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.userEmail = userData.username; // Assuming email is stored in the 'email' property
    }
  }


openChangeEmailDialog(): void {
    const dialogRef = this.dialog.open(EmailchangeComponent, {
      width: '400px', // Adjust width as needed
      // You can add more dialog configuration options here
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  changePassword(): void {
    console.log('called')
    this.apiService.changePassword(this.newPassword,this.currentPassword)
      .subscribe((response: any) => {
        console.log(response); // Handle response from the server
        this.openSnackBar('Password changed successfully', 'success');
        // Reset form or perform any other action as needed
      }, (error) => {
        console.error(error); // Handle error
        this.openSnackBar('Failed to change password', 'error');
      });
  }

  confirmDelete(): void {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      this.deleteAccount();
    }
  }

  deleteAccount(): void {
    this.apiService.deleteAccount()
      .subscribe(() => {
        // Logout user and perform any other necessary actions
        // For example, clear local storage and navigate to login page
        localStorage.clear();
        // Redirect to login page
        // Replace '/login' with the appropriate route
        window.location.href = '/login';
      }, (error) => {
        console.error(error); // Handle error
        this.openSnackBar('Failed to delete account', 'error');
      });
  }

  openSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}
