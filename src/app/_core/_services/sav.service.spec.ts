import { TestBed } from '@angular/core/testing';

import { SAVService } from './sav.service';

describe('SAVService', () => {
  let service: SAVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SAVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
