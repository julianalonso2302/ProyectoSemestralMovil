export class Torneo {
  id_torneo!: number;          // ID del torneo, que será la clave primaria
  nombre_torneo!: string;      // Nombre del torneo
  descripcion!: string;        // Descripción del torneo
  fecha_inicio!: string;       // Fecha de inicio del torneo
  fecha_fin!: string;          // Fecha de fin del torneo
  tipo_deporte!: string;       // Tipo de deporte del torneo
  estado_torneo!: string;      // Estado del torneo (activo, inactivo, etc.)
}

