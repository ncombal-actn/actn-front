import { TestBed } from '@angular/core/testing';

import { ComponentsInteractionService } from './components-interaction.service';

describe('ComponentsInteractionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentsInteractionService = TestBed.get(ComponentsInteractionService);
    expect(service).toBeTruthy();
  });
});
