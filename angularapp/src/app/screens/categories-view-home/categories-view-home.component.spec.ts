import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesViewHomeComponent } from './categories-view-home.component';

describe('CategoriesViewHomeComponent', () => {
  let component: CategoriesViewHomeComponent;
  let fixture: ComponentFixture<CategoriesViewHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesViewHomeComponent]
    });
    fixture = TestBed.createComponent(CategoriesViewHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
