import { Component, OnInit } from '@angular/core';
import { FutbolitoService } from 'src/app/services/futbolito.service' ; // Verifica la ruta
import { PadelService } from 'src/app/services/padel.service'        // Verifica la ruta
import { Torneo } from 'src/app/services/torneo.service'        // Verifica la ruta
import { Cancha } from 'src/app/services/cancha.service'        // Verifica la ruta
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  selectedSegment: string = 'reservas'; // Asegúrate de que esta línea esté aquí
  reservas: any[] = [];
  canchas: any[] = [];
  torneos: any[] = [];

  constructor(
    private futbolitoService: FutbolitoService,
    private padelService: PadelService,

    private canchaService: Cancha,
    private torneoService: Torneo
  ) {}

  ngOnInit() {
    this.loadReservas();
    this.loadCanchas();
    this.loadTorneos();
  }

  loadReservas() {
    
    const reservasPadel = this.padelService.obtenerReservas() || [];
   
  }

  loadCanchas() {
    
  }

  loadTorneos() {
    
  }

  eliminarReserva(id: number) {

    this.padelService.eliminarReserva(id);
    this.loadReservas();
  }

  agregarCancha(nuevaCancha: any) {
   
  }

  bloquearCancha(id: number) {
    
  }

  agregarTorneo(nuevoTorneo: any) {
  
  }

  eliminarTorneo(id: number) {
  
  }
}
