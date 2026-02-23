import { TestBed } from '@angular/core/testing';

import { GoldPlannerService } from './gold-planner.service';

describe('GoldPlannerService', () => {
  let service: GoldPlannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoldPlannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
