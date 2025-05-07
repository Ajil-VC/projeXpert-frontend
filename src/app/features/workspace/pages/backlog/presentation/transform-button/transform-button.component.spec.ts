import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformButtonComponent } from './transform-button.component';

describe('TransformButtonComponent', () => {
  let component: TransformButtonComponent;
  let fixture: ComponentFixture<TransformButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
