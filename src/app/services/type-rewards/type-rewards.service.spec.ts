import { TestBed } from '@angular/core/testing';

import { TypeRewardsService } from './type-rewards.service';

describe('TypeRewardsService', () => {
  let service: TypeRewardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeRewardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
