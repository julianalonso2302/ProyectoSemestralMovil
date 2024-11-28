import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FutbolitoService {
  obtenerHistorialReservas(): any[] {
    throw new Error('Method not implemented.');
  }
  agregarReserva(selectedCancha: string, selectedDate: string, selectedHour: string) {
    throw new Error('Method not implemented.');
  }
  private reservas: any[] = []; // Aquí se almacenan las reservas

  constructor() {
    // Inicializa algunas reservas de ejemplo
    this.reservas = [
      { id: 1, cancha: 'Cancha 1', fecha: '2024-09-23', hora: '18:00-19:00' },
      { id: 2, cancha: 'Cancha 2', fecha: '2024-09-24', hora: '19:00-20:00' },
    ];
  }

  obtenerReservas(): any[] {
    // Retorna la lista de reservas
    return this.reservas;
  }

  eliminarReserva(id: number) {
    // Implementa la lógica para eliminar una reserva
    this.reservas = this.reservas.filter(reserva => reserva.id !== id);
  }
}

