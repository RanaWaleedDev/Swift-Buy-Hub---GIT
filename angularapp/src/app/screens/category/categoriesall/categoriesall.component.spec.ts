import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesallComponent } from './categoriesall.component';

describe('CategoriesallComponent', () => {
  let component: CategoriesallComponent;
  let fixture: ComponentFixture<CategoriesallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesallComponent]
    });
    fixture = TestBed.createComponent(CategoriesallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
