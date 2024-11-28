import { TestBed } from '@angular/core/testing';

import { FutbolitoService } from './futbolito.service';

describe('FutbolitoService', () => {
  let service: FutbolitoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FutbolitoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
