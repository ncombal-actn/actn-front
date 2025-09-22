/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CotationService } from './cotation.service';

describe('Service: Cotation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CotationService]
    });
  });

  it('should ...', inject([CotationService], (service: CotationService) => {
    expect(service).toBeTruthy();
  }));
});
