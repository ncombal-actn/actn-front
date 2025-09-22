import { TestBed } from '@angular/core/testing';

import { OnlywanService } from './onlywan.service';

describe('OnlywanService', () => {
  let service: OnlywanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlywanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
