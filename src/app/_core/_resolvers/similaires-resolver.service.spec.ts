import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { SimilairesResolverService } from './similaires-resolver.service';


describe('similairesResolverService', () => {
  let service: SimilairesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimilairesResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
