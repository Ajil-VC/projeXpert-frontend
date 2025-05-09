import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIssueButtonComponent } from './create-issue-button.component';

describe('CreateIssueButtonComponent', () => {
  let component: CreateIssueButtonComponent;
  let fixture: ComponentFixture<CreateIssueButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIssueButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIssueButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
