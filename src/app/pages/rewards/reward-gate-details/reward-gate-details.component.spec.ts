import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardGateDetailsComponent } from './reward-gate-details.component';

describe('RewardGateDetailsComponent', () => {
  let component: RewardGateDetailsComponent;
  let fixture: ComponentFixture<RewardGateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardGateDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardGateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
