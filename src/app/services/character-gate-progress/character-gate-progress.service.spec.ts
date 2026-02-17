import { TestBed } from '@angular/core/testing';

import { CharacterGateProgressService } from './character-gate-progress.service';

describe('CharacterGateProgressService', () => {
  let service: CharacterGateProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterGateProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
