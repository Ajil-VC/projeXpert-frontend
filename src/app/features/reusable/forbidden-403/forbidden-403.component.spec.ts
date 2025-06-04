import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forbidden403Component } from './forbidden-403.component';

describe('Forbidden403Component', () => {
  let component: Forbidden403Component;
  let fixture: ComponentFixture<Forbidden403Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forbidden403Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forbidden403Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
