import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBotComponent } from './search-bot.component';

describe('SearchBotComponent', () => {
  let component: SearchBotComponent;
  let fixture: ComponentFixture<SearchBotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBotComponent]
    });
    fixture = TestBed.createComponent(SearchBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
