import { TestBed, inject } from '@angular/core/testing';

import { ItemsServicesService } from './items-services.service';

describe('ItemsServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemsServicesService]
    });
  });

  it('should be created', inject([ItemsServicesService], (service: ItemsServicesService) => {
    expect(service).toBeTruthy();
  }));
});
