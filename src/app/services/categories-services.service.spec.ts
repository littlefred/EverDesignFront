import { TestBed, inject } from '@angular/core/testing';

import { CategoriesServicesService } from './categories-services.service';

describe('CategoriesServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesServicesService]
    });
  });

  it('should be created', inject([CategoriesServicesService], (service: CategoriesServicesService) => {
    expect(service).toBeTruthy();
  }));
});
