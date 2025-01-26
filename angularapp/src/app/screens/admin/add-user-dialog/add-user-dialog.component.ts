import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {
  userData: any = {
    username: '',
    email: '',
    password: '',
    contact: ''
  };

  constructor(
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private apiService: ApiConfigServiceService
  ) {}

  ngOnInit(): void {}

  addUser(): void {
    this.apiService.registerUser(this.userData).subscribe(
      () => {
        // User added successfully
        this.dialogRef.close('success');
      },
      (error) => {
        console.error('Error adding user:', error);
        // Handle error here
      }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
