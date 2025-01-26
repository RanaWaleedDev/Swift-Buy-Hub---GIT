import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApiConfigServiceService } from 'src/app/api-config-service.service';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.css'],
  animations: [
    trigger('customCard', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class PostAddComponent {
  postForm: FormGroup;
  uploadedImages: File[] = [];


  constructor(
    public dialogRef: MatDialogRef<PostAddComponent>,
     private fb: FormBuilder,
     private apiService:ApiConfigServiceService
     ) {
    this.postForm = this.fb.group({
      selectedCategory: ['cars', Validators.required],
      // Add default form controls for laptop and car details
      company: [''],
      typeName: [''],
      Ram:[''],
      Weight:[''],
      Touchscreen:[''],
      Ips:[''],
      ppi:[''],
      Cpubrand:[''],
      HDD:['0'],
      SSD:['0'],
      Gpubrand:[''],
      os:[''],
      Inches: ['', Validators.required],
      pixels: ['', Validators.required],


      // Add other laptop details form controls here
      engineCapacity: [''],
      modelYear: [''],  
      Mileage:[''],
      Company:[''],
      Vaarient:[''],
      EngineType:[''],
      Transmission:[''],
      BodyType:[''],
      accident: [false], 
      // Add other car details form controls here
      location: [''],
      description: [''],
      price: ['0']

    });

    // this.postForm.valueChanges.subscribe((formValues) => {
    //   console.log('Form Values:', formValues);
    // });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.uploadedImages.push(files[i]);
      }
    }
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

  PostAdd(): void {
    const selectedCategory = this.postForm.value.selectedCategory;

    if (selectedCategory === 'laptops') {
      this.saveLaptopData();
    } else if (selectedCategory === 'cars') {
      this.saveCarData();
    }
  }
  
  private saveLaptopData(): void {
    // Create a FormData object to upload files
    const formData = new FormData();
  
    // Append the selected images to the FormData object
    for (const image of this.uploadedImages) {
      formData.append('images', image);
    }

    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userId = userData.userId;
      formData.append('userId', userId);
    }
    
    const pixels = this.postForm.value.pixels;
    const [X_res, Y_res] = pixels.split('*').map(Number);
    const Inches = Number(this.postForm.value.Inches);
    // const ppi = Math.sqrt(X_res ** 2 + Y_res ** 2) / Inches;

    // Append other laptop data to the FormData object
    formData.append('price', this.postForm.value.price);

    formData.append('selectedCategory', this.postForm.value.selectedCategory);
    formData.append('company', this.postForm.value.company);
    formData.append('typeName', this.postForm.value.typeName);
    formData.append('Ram', this.postForm.value.Ram);
    formData.append('Weight', this.postForm.value.Weight);
    formData.append('Touchscreen', this.postForm.value.Touchscreen);
    formData.append('Ips', this.postForm.value.Ips);
    formData.append('ppi', this.postForm.value.ppi);
    formData.append('Cpubrand', this.postForm.value.Cpubrand);
    formData.append('HDD', this.postForm.value.HDD);
    formData.append('SSD', this.postForm.value.SSD);
    formData.append('Gpubrand', this.postForm.value.Gpubrand);
    formData.append('os', this.postForm.value.os);
    formData.append('description', this.postForm.value.description);
    formData.append('location', this.postForm.value.location);
    formData.append('Inches', this.postForm.value.Inches);
    formData.append('pixels', this.postForm.value.pixels);
    // Send the FormData object to the backend API
    this.apiService.saveLaptop(formData).subscribe(
      (response) => {
        console.log('Laptop data saved successfully:', response);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error saving laptop data:', error);
      }
    );
  }
  

  private saveCarData(): void {
    // Create a FormData object to upload files
    const formData = new FormData();


    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userId = userData.userId;
      formData.append('userId', userId);
    }

    // Append the selected images to the FormData object
    for (const image of this.uploadedImages) {
      formData.append('images', image);
    }
  
    // Append other car data to the FormData object
    formData.append('price', this.postForm.value.price);
    formData.append('selectedCategory', this.postForm.value.selectedCategory);
    formData.append('engineCapacity', this.postForm.value.engineCapacity);
    formData.append('modelYear', this.postForm.value.modelYear);
    formData.append('Mileage', this.postForm.value.Mileage);
    formData.append('Company', this.postForm.value.Company);
    formData.append('Vaarient', this.postForm.value.Vaarient);
    formData.append('EngineType', this.postForm.value.EngineType);
    formData.append('Transmission', this.postForm.value.Transmission);
    formData.append('BodyType', this.postForm.value.BodyType);
    formData.append('accident', this.postForm.value.accident);
    formData.append('location', this.postForm.value.location);
    formData.append('description', this.postForm.value.description);
  
    // Send the FormData object to the backend API
    this.apiService.saveCar(formData).subscribe(
      (response) => {
        console.log('Car data saved successfully:', response);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error saving car data:', error);
      }
    );
  }
  


  selectedTabIndex = 0;

  nextTab() {
    this.selectedTabIndex = Math.min(this.selectedTabIndex + 1, 2); // 2 is the index of the last tab
  }

  prevTab() {
    this.selectedTabIndex = Math.max(this.selectedTabIndex - 1, 0);
  }

  updateFormControls(): void {
    const selectedCategory = this.postForm.value.selectedCategory;

    if (selectedCategory === 'laptops') {
      // Set laptop details form controls
      this.postForm.patchValue({
        company: '',
        typeName: '',
        Ram:'',
        Weight:'',
        Touchscreen:'',
        Ips:'',
        ppi:'',
        Cpubrand:'',
        HDD:'',
        SSD:'',
        Gpubrand:'',
        os:'',
        location: [''],

        description: [''],
        price: ['0']
  
        // Set other laptop details form controls here
      });
    } else if (selectedCategory === 'cars') {
      // Set car details form controls
      this.postForm.patchValue({
        engineCapacity: '',
        modelYear: '',
        Mileage:'',
        Company:'',
        Vaarient:'',
        EngineType:'',
        Transmission:'',
        BodyType:'',
        location: [''],
        accident: [false], 
        description: [''],
        price: ['0']
        // Set other car details form controls here
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
