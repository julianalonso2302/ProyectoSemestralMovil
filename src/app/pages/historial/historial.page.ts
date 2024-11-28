import { Component, OnInit } from '@angular/core';
import { BDserviceService } from 'src/app/services/bdservice.service';
import { Reserva } from 'src/app/services/reservas.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  correo: string = ''; // Variable para capturar el correo del usuario
  historialReservas: Reserva[] = []; // Arreglo para almacenar las reservas encontradas

  constructor(private bdService: BDserviceService) {}

  ngOnInit() {}

  consultarHistorial() {
    if (this.correo) {
      this.historialReservas = this.bdService.obtenerReservasPorCorreo(this.correo); // Obtener reservas filtradas por correo
      if (this.historialReservas.length === 0) {
        console.log('No se encontraron reservas para este correo');
      } else {
        console.log('Reservas encontradas:', this.historialReservas);
      }
    } else {
      console.log('Por favor ingresa un correo');
    }
  }
}
