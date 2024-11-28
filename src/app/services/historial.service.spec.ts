import { TestBed } from '@angular/core/testing';

import { HistorialReserva } from './historial.service';

describe('HistorialReserva', () => {
  let service: HistorialReserva;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialReserva);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
