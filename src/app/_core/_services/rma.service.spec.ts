import { TestBed } from '@angular/core/testing';

import { RmaService } from './rma.service';

describe('RmaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RmaService = TestBed.get(RmaService);
    expect(service).toBeTruthy();
  });
});
