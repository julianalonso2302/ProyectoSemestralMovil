import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BDserviceService } from 'src/app/services/bdservice.service';
import { Reserva } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-futbolito',
  templateUrl: './futbolito.page.html',
  styleUrls: ['./futbolito.page.scss'],
})
export class FutbolitoPage implements OnInit {
  selectedCancha!: number;
  selectedDate!: string;
  selectedHour!: string;
  correo!: string; // Variable para el correo
  minDate: string = new Date().toISOString().split('T')[0];
  canchasDisponibles = [
    { id: 1, nombre: 'Fútbol Cancha 1' },
    { id: 2, nombre: 'Fútbol Cancha 2' },
    { id: 3, nombre: 'Fútbol Cancha 3' },
  ];
  horasPredeterminadas = ['18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00'];

  constructor(public alertController: AlertController, private bdService: BDserviceService) {}

  ngOnInit() {}

  async confirmarReserva() {
    if (this.selectedCancha && this.selectedDate && this.selectedHour && this.correo) {
      const nuevaReserva: Reserva = {
        id_reserva: 0, // Se ignora al guardar en localStorage
        id_usuario: 1, // Cambiar por el ID del usuario correspondiente
        id_cancha: this.selectedCancha,
        fecha_reserva: new Date(this.selectedDate + 'T' + this.selectedHour.split('-')[0]),
        horario: this.selectedHour,
        estado_reserva: 'Confirmada',
        correo: this.correo, // Correo del usuario
      };

      this.bdService.guardarReserva(nuevaReserva); // Guardar la nueva reserva en localStorage
      const alert = await this.alertController.create({
        header: 'Reserva Confirmada',
        message: `Tu reserva para la cancha ${this.selectedCancha} ha sido confirmada.`,
        buttons: ['OK']
      });
      await alert.present();
      this.limpiarSeleccion(); // Limpiar campos después de la reserva
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor completa todos los campos.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  limpiarSeleccion() {
    this.selectedCancha = undefined!;
    this.selectedDate = this.minDate;
    this.selectedHour = '';
    this.correo = '';
  }
}
