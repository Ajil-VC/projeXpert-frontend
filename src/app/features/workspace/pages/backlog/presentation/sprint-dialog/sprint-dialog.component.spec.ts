import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintDialogComponent } from './sprint-dialog.component';

describe('SprintDialogComponent', () => {
  let component: SprintDialogComponent;
  let fixture: ComponentFixture<SprintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
