import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TorneosPage } from './torneos.page'; // Verifica la ruta

describe('TorneosPage', () => {
  let component: TorneosPage;
  let fixture: ComponentFixture<TorneosPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TorneosPage], // Asegúrate de incluir la declaración del componente
    }).compileComponents();

    fixture = TestBed.createComponent(TorneosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
