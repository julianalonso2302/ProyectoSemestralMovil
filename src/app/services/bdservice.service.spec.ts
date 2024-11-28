import { TestBed } from '@angular/core/testing';

import { BDserviceService } from './bdservice.service';

describe('BDserviceService', () => {
  let service: BDserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BDserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
