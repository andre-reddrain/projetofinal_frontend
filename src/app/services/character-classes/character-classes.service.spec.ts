import { TestBed } from '@angular/core/testing';

import { CharacterClassesService } from './character-classes.service';

describe('CharacterClassesService', () => {
  let service: CharacterClassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterClassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
