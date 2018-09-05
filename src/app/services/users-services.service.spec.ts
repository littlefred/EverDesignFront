import { TestBed, inject } from '@angular/core/testing';

import { UsersServicesService } from './users-services.service';

describe('UsersServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersServicesService]
    });
  });

  it('should be created', inject([UsersServicesService], (service: UsersServicesService) => {
    expect(service).toBeTruthy();
  }));
});
