import { TestBed } from '@angular/core/testing';

import { GateDetailsService } from './gate-details.service';

describe('GateDetailsService', () => {
  let service: GateDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GateDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
