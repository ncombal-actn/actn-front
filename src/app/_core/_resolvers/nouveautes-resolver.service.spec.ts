import { TestBed } from '@angular/core/testing';

import { NouveautesResolverService } from './nouveautes-resolver.service';

describe('NouveautesResolverService', () => {
  let service: NouveautesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NouveautesResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
