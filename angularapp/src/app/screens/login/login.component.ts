import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  userId: string = '';
  loading: boolean = false;
  submitted: boolean = false; // Flag to track form submission

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private apiConfigService: ApiConfigServiceService
  ) {}

  setSubmitted() {
    console.log('set')
    this.submitted = true;
  }


  
  navigateToSignUp() {
    this.router.navigateByUrl('/sign-up'); // Navigate to /sign-up route
  }


  navigateToResetPass() {
    this.router.navigateByUrl('/login/resetpassword'); // Navigate to /sign-up route
  }



  onSubmit() {
   
    this.submitted = true; // Set the submitted flag to true
    console.log('submitted',this.submitted )
    if (!this.username || !this.password) {
      return; // If username or password is empty, do not proceed
    }

    this.loading = true;
    const userData = {
      e_mail: this.username,
      password: this.password
    };

    // Call the API service to perform login
    this.apiConfigService.LoginUser(userData).subscribe(
      (response) => {
        this.loading = false;
        if (response.user.role == 'admin') {
          this.router.navigate(['/users/admin/', response.user._id]);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        this.loading = false;
        console.error('Login failed:', error);
        // Handle error, show a message, etc.
      }
    );
  }
}
