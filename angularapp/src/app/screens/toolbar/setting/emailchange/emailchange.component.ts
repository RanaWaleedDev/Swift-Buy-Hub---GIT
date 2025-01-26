import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-emailchange',
  templateUrl: './emailchange.component.html',
  styleUrls: ['./emailchange.component.css']
})
export class EmailchangeComponent {
  currentUsername: string ='';
  newUsername: string='';


  constructor(
    public dialogRef: MatDialogRef<EmailchangeComponent>,
    private apiService: ApiConfigServiceService,
    private snackBar: MatSnackBar
  ) { }

 changeUsername(): void {
    this.apiService.updateUsername(this.newUsername).subscribe((response: any) => {
      console.log(response); // Handle success response
      this.closeDialog();
    }, (error) => {
      console.error(error); // Handle error
      // Display error message to user
    });
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}
