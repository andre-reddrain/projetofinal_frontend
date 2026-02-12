import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidPlannerComponent } from './raid-planner.component';

describe('RaidPlannerComponent', () => {
  let component: RaidPlannerComponent;
  let fixture: ComponentFixture<RaidPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaidPlannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaidPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
