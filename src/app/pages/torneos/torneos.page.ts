import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-torneos',
  templateUrl: './torneos.page.html',
  styleUrls: ['./torneos.page.scss'],
})
export class TorneosPage implements OnInit {
  torneos = [
    {
      id: 1,
      nombre: 'Copa Intersede',
      descripcion: '!Juega en este competitivo torneo y demuestra que eres el mejor¡',
      unido: false,
      foto: './assets/copa1.jpg' // Ruta de la imagen de la copa
    },
    {
      id: 2,
      nombre: 'Copa Regional',
      descripcion: '!Juega en este competitivo torneo y demuestra que eres el mejor¡',
      unido: false,
      foto: './assests/copa2.jpg' // Ruta de la imagen de otra copa
    },
    // Agrega más torneos según sea necesario
  ];

  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  async unirseATorneo(torneo: any) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Te has unido al torneo con éxito.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            torneo.unido = true; // Cambia el estado a unido
          },
        },
      ],
    });

    await alert.present();
  }

  async salirDelTorneo(torneo: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas salir del torneo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            torneo.unido = false; // Cambia el estado a no unido
            this.alertaSalidaExitosa();
          },
        },
      ],
    });

    await alert.present();
  }

  async alertaSalidaExitosa() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Te has salido del torneo con éxito.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
