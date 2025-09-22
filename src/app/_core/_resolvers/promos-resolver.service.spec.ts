import { TestBed } from '@angular/core/testing';

import { PromosResolverService } from './promos-resolver.service';

describe('PromosResolverService', () => {
  let service: PromosResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromosResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
