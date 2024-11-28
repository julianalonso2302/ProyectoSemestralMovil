export class HistorialReserva {
  id_historial!: number;     // ID del historial de la reserva
  id_reserva!: number;       // ID de la reserva
  id_cancha!: number;        // ID de la cancha
  fecha_reserva!: Date;      // Fecha de la reserva
  horario!: string;          // Horario de la reserva
  estado_reserva!: string;   // Estado de la reserva
  nombre_cancha!: string;    // Nombre de la cancha
  id_usuario!: number;       // ID del usuario que hizo la reserva
}
