import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  loading: boolean = false; // Variable to control loading indicator

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private ApiConfigServiceService:ApiConfigServiceService
    ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      contact: ['', Validators.required],
      password: ['', Validators.required],
      reenterPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.loading = true; // Show loading indicator

      const formData = this.signupForm.value;

      // Call the user service to register the user
      this.ApiConfigServiceService.registerUser(formData).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['login']);        
        },
        (error) => {
          console.error('Registration failed:', error);
          // Handle error, show error message, etc.
        }
      );
    } else {
      console.log('Form is invalid. Validation errors:', this.signupForm.errors);
      // Mark all fields as touched to display validation errors
      Object.values(this.signupForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
