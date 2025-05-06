import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogHeaderComponent } from './backlog-header.component';

describe('BacklogHeaderComponent', () => {
  let component: BacklogHeaderComponent;
  let fixture: ComponentFixture<BacklogHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BacklogHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BacklogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
