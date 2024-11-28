import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/maps.service'; // Asegúrate de importar tu servicio de mapas

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.page.html',
  styleUrls: ['./nosotros.page.scss'],
})
export class NosotrosPage implements OnInit {
  mapElement: HTMLElement | null = null; // Inicializar como null

  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.mapElement = document.getElementById('map') as HTMLElement;
    if (this.mapElement) { // Verificar que el elemento existe
      this.mapService.createMap(this.mapElement);
      this.addMarkers();
    }
  }

  addMarkers() {
    // Coordenadas de las canchas en Duoc UC Plaza Norte
    const canchas = [
      { lat: -33.368195, lng: -70.620568, title: 'Cancha Fútbol 1' },
      { lat: -33.368195, lng: -70.620578, title: 'Cancha Fútbol 2' },
      { lat: -33.368195, lng: -70.620588, title: 'Cancha Pádel' }
    ];

    canchas.forEach(canch => {
      this.mapService.addMarker(canch.lat, canch.lng, canch.title);
    });
  }
}
