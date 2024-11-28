import { Injectable } from '@angular/core';
import { GoogleMaps, GoogleMap, LatLng, Marker } from '@ionic-native/google-maps/ngx';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map: GoogleMap | undefined; // Hacer que el mapa sea opcional

  constructor(private googleMaps: GoogleMaps) {}

  // Método para crear el mapa
  createMap(element: HTMLElement) {
    this.map = this.googleMaps.create(element, {
      camera: {
        target: {
          lat: -34.9290, // Latitud inicial
          lng: 138.6010, // Longitud inicial
        },
        zoom: 10,
      },
    });
  }

  // Método para agregar un marcador al mapa
  addMarker(latitude: number, longitude: number, title: string) {
    if (this.map) { // Verificar que el mapa esté inicializado
      const position: LatLng = new LatLng(latitude, longitude);
      const marker: Marker = this.map.addMarkerSync({
        position,
        title,
      });
    } else {
      console.error('El mapa no ha sido inicializado. Asegúrate de llamar a createMap primero.');
    }
  }
}
