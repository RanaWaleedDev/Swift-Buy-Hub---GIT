import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToInspectComponent } from './to-inspect.component';

describe('ToInspectComponent', () => {
  let component: ToInspectComponent;
  let fixture: ComponentFixture<ToInspectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToInspectComponent]
    });
    fixture = TestBed.createComponent(ToInspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
