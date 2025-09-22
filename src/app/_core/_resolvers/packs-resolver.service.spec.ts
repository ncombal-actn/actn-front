import { TestBed } from '@angular/core/testing';

import { PacksResolverService } from './packs-resolver.service';

describe('PacksResolverService', () => {
  let service: PacksResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacksResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
