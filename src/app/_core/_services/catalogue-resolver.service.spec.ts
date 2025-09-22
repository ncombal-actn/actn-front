import { TestBed } from '@angular/core/testing';

import { CatalogueResolverService } from './catalogue-resolver.service';

describe('CatalogueResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatalogueResolverService = TestBed.get(CatalogueResolverService);
    expect(service).toBeTruthy();
  });
});
