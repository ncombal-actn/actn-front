import { TestBed } from '@angular/core/testing';

import { CatalogueSearchPredictionService } from './catalogue-search-prediction.service';

describe('CatalogueSearchPredictionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatalogueSearchPredictionService = TestBed.get(CatalogueSearchPredictionService);
    expect(service).toBeTruthy();
  });
});
