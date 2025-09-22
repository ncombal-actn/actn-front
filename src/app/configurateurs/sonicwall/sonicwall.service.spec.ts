import { TestBed } from '@angular/core/testing';

import { SonicwallService } from './sonicwall.service';

describe('SonicwallService', () => {
  let service: SonicwallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SonicwallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
