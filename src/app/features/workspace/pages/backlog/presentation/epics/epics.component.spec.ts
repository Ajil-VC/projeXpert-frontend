import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpicsComponent } from './epics.component';

describe('EpicsComponent', () => {
  let component: EpicsComponent;
  let fixture: ComponentFixture<EpicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
