import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePswrdComponent } from './change-pswrd.component';

describe('ChangePswrdComponent', () => {
  let component: ChangePswrdComponent;
  let fixture: ComponentFixture<ChangePswrdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePswrdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePswrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
