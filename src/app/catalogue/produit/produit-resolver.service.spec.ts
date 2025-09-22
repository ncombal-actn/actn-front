import { TestBed } from '@angular/core/testing';

import { ProduitResolverService } from './produit-resolver.service';

describe('ProduitResolverService', () => {
  let service: ProduitResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProduitResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
