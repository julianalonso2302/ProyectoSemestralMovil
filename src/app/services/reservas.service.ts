export class Reserva {
  id_reserva!: number;         // ID de la reserva
  id_usuario!: number;         // ID del usuario que realiza la reserva
  id_cancha!: number;          // ID de la cancha reservada
  fecha_reserva!: Date;        // Fecha y hora de la reserva
  horario!: string;            // Horario de la reserva
  estado_reserva!: string;     // Estado de la reserva (confirmada, cancelada, etc.)
  correo!: string;             // Correo del usuario
}
