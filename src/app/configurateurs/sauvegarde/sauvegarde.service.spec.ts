import { TestBed } from '@angular/core/testing';

import { SauvegardeService } from './sauvegarde.service';

describe('SauvegardeService', () => {
  let service: SauvegardeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SauvegardeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
