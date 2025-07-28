import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCreationModalComponent } from './plan-creation-modal.component';

describe('PlanCreationModalComponent', () => {
  let component: PlanCreationModalComponent;
  let fixture: ComponentFixture<PlanCreationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanCreationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanCreationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
