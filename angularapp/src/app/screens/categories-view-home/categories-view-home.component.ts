import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categories-view-home',
  templateUrl: './categories-view-home.component.html',
  styleUrls: ['./categories-view-home.component.css']
})
export class CategoriesViewHomeComponent {
  constructor(private router: Router,private _snackBar: MatSnackBar) {}

  showSnackbar() {
    this._snackBar.open('No more categories', 'Dismiss', {
      duration: 9000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  handleClick(category: string) {
    // Add logic for click event based on the category
    console.log('Category clicked:', category);
    this.router.navigate([`/category/view/${category}`]);
  }


}
