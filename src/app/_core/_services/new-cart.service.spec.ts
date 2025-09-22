import { TestBed } from '@angular/core/testing';

import { NewCartService } from './new-cart.service';

describe('NewCartService', () => {
  let service: NewCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
