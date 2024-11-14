import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersPageComponent } from './answers-page.component';

describe('AnswersPageComponent', () => {
  let component: AnswersPageComponent;
  let fixture: ComponentFixture<AnswersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswersPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
