import { TestBed } from '@angular/core/testing';

import { CharacterRaidsService } from './character-raids.service';

describe('CharacterRaidsService', () => {
  let service: CharacterRaidsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterRaidsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
