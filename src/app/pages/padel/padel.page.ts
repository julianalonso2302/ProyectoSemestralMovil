import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BDserviceService } from 'src/app/services/bdservice.service';
import { Reserva } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-padel',
  templateUrl: './padel.page.html',
  styleUrls: ['./padel.page.scss'],
})
export class PadelPage implements OnInit {
  selectedCancha!: number;
  selectedDate!: string;
  selectedHour!: string;
  correo!: string; // Variable para el correo
  minDate: string = new Date().toISOString().split('T')[0];
  defaultDate: string = new Date().toISOString().split('T')[0];

  canchasDisponibles = [
    { id: 1, nombre: 'Padel Cancha 1' },
    { id: 2, nombre: 'Padel Cancha 2' },
    { id: 3, nombre: 'Padel Cancha 3' },
  ];

  horasPredeterminadas = ['18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00'];

  constructor(public alertController: AlertController, private bdService: BDserviceService) {}

  ngOnInit() {
    this.selectedDate = this.defaultDate;
    this.selectedHour = '';
  }

  async confirmarReserva() {
    if (this.selectedCancha && this.selectedDate && this.selectedHour && this.correo) {
      const nuevaReserva: Reserva = {
        id_reserva: 0, // Ignorado al guardar en localStorage
        id_usuario: 1, // Cambia por el ID del usuario correspondiente
        id_cancha: this.selectedCancha,
        fecha_reserva: new Date(this.selectedDate + 'T' + this.selectedHour.split('-')[0]),
        horario: this.selectedHour,
        estado_reserva: 'Confirmada',
        correo: this.correo, // Correo del usuario
      };

      // Guarda la reserva en el servicio
      this.bdService.guardarReserva(nuevaReserva);

      const alert = await this.alertController.create({
        header: 'Reserva Confirmada',
        message: `Se ha reservado la cancha ${this.selectedCancha} para el ${this.selectedDate} desde ${this.selectedHour}.`,
        buttons: ['OK'],
      });

      await alert.present();
      this.limpiarSeleccion(); // Limpia los campos después de la reserva
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor completa todos los campos.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  limpiarSeleccion() {
    this.selectedCancha = undefined!;
    this.selectedDate = this.defaultDate;
    this.selectedHour = '';
    this.correo = ''; // Limpia el correo también
  }
}
