import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEpicComponent } from './create-epic.component';

describe('CreateEpicComponent', () => {
  let component: CreateEpicComponent;
  let fixture: ComponentFixture<CreateEpicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEpicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEpicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
