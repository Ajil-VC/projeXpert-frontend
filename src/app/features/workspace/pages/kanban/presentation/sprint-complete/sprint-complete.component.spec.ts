import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintCompleteComponent } from './sprint-complete.component';

describe('SprintCompleteComponent', () => {
  let component: SprintCompleteComponent;
  let fixture: ComponentFixture<SprintCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintCompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
