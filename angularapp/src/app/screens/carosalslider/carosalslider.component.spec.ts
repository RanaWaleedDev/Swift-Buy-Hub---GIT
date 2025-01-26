import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarosalsliderComponent } from './carosalslider.component';

describe('CarosalsliderComponent', () => {
  let component: CarosalsliderComponent;
  let fixture: ComponentFixture<CarosalsliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarosalsliderComponent]
    });
    fixture = TestBed.createComponent(CarosalsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
