import { TestBed } from '@angular/core/testing';

import { ConfigurateurService } from './configurateur.service';

describe('ConfigurateurService', () => {
  let service: ConfigurateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
