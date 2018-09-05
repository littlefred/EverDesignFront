import { TestBed, inject } from '@angular/core/testing';

import { CaddyServicesService } from './caddy-services.service';

describe('CaddyServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaddyServicesService]
    });
  });

  it('should be created', inject([CaddyServicesService], (service: CaddyServicesService) => {
    expect(service).toBeTruthy();
  }));
});
