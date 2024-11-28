import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Usuario } from './usuario.service';
import { Cancha } from './cancha.service';
import { Reserva } from './reservas.service';
import { BehaviorSubject } from 'rxjs';
import { Torneo } from './torneo.service';
import { HistorialReserva } from './historial.service';





@Injectable({
  providedIn: 'root'
})
export class BDserviceService {
  //variable de conexión a Base de Datos
  public database!: SQLiteObject;
  private reservas: Reserva[] = [];

  //variables de creación de tablas
  tablaCanchas: string = `CREATE TABLE IF NOT EXISTS canchas (
    id_cancha INTEGER PRIMARY KEY AUTOINCREMENT, 
    tipo_deporte TEXT NOT NULL, 
    nombre_cancha TEXT NOT NULL, 
    estado_cancha TEXT NOT NULL
  );`;

  tablaRoles: string = `CREATE TABLE IF NOT EXISTS roles (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT, 
    nombre_rol TEXT NOT NULL
  );`;

  tablaUsuarios: string = `CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, 
    nombre TEXT NOT NULL, 
    id_rol INTEGER NOT NULL, 
    email TEXT NOT NULL, 
    contrasena TEXT NOT NULL, 
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
  );`;

  tablaReservas: string = `CREATE TABLE IF NOT EXISTS reservas (
    id_reserva INTEGER PRIMARY KEY AUTOINCREMENT, 
    id_usuario INTEGER NOT NULL, 
    id_cancha INTEGER NOT NULL, 
    fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP, 
    horario TEXT NOT NULL, 
    estado_reserva TEXT NOT NULL, 
    correo TEXT NOT NULL,  -- Nueva columna para almacenar el correo electrónico
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario), 
    FOREIGN KEY(id_cancha) REFERENCES canchas(id_cancha)
  );`;


  tablaHistorialReservas: string = `CREATE TABLE IF NOT EXISTS historial_reservas (
    id_historial INTEGER PRIMARY KEY AUTOINCREMENT, 
    id_reserva INTEGER NOT NULL, 
    id_usuario INTEGER NOT NULL, 
    id_cancha INTEGER NOT NULL, 
    fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP, 
    estado_reserva TEXT NOT NULL,
    nombre_cancha TEXT NOT NULL,  -- Agregado para almacenar el nombre de la cancha
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha)
  );`;



  tablaTorneos: string = `CREATE TABLE IF NOT EXISTS torneos (
    id_torneo INTEGER PRIMARY KEY AUTOINCREMENT, 
    nombre_torneo TEXT NOT NULL, 
    descripcion TEXT NOT NULL, 
    fecha_inicio TEXT NOT NULL, 
    fecha_fin TEXT NOT NULL, 
    tipo_deporte TEXT NOT NULL, 
    estado_torneo TEXT NOT NULL
  );`;

  tablaInscripcionesTorneo: string = `CREATE TABLE IF NOT EXISTS inscripciones_torneo (
    id_inscripcion INTEGER PRIMARY KEY AUTOINCREMENT, 
    id_torneo INTEGER NOT NULL, 
    id_usuario INTEGER NOT NULL, 
    fecha_inscripcion TEXT NOT NULL, 
    FOREIGN KEY(id_torneo) REFERENCES torneos(id_torneo), 
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)
  );`;

  // Ejemplo de registro inicial de roles
  registroRoles: string = `INSERT OR IGNORE INTO roles (id_rol, nombre_rol) 
  VALUES (1, 'Admin'), (2, 'Usuario');`;

  // Ejemplo de registro inicial de usuarios
  registroUsuarios: string = `INSERT OR IGNORE INTO usuarios (id_usuario, nombre, id_rol, email, contrasena) 
  VALUES (1, 'Admin', 1, 'admin@gmail.com', 'admin'), (2, 'Usuario', 2, 'usuario@gmail.com', 'usuario');`;

  // Ejemplo de registro inicial de canchas
  registroCanchas: string = `INSERT OR IGNORE INTO canchas (id_cancha, tipo_deporte, nombre_cancha, estado_cancha) 
  VALUES (1, 'Futbolito', 'Cancha 1', 'Disponible'), (2, 'Pádel', 'Cancha 2', 'Ocupado');`;

  // BehaviorSubjects para actualizar la data en tiempo real
  listadoUsuarios = new BehaviorSubject([]);
  listadoRoles = new BehaviorSubject([]);
  listadoCanchas = new BehaviorSubject([]);
  listadoReservas = new BehaviorSubject([]);
  listadoTorneos = new BehaviorSubject([]);
  listadoInscripciones = new BehaviorSubject([]);
  listadoHistorialReservas = new BehaviorSubject([]);

  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.createBD();
    this.cargarReservas();
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  fetchUsuarios(): Observable<any[]> {
    return this.listadoUsuarios.asObservable();
  }

  fetchCanchas(): Observable<any[]> {
    return this.listadoCanchas.asObservable();
  }

  fetchReservas(): Observable<any[]> {
    return this.listadoReservas.asObservable();
  }

  fetchTorneos(): Observable<any[]> {
    return this.listadoTorneos.asObservable();
  }

  fetchInscripciones(): Observable<any[]> {
    return this.listadoInscripciones.asObservable();
  }

  fetchHistorial(): Observable<any[]> {
    return this.listadoHistorialReservas.asObservable();
  }

  async createBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'arriendo_canchas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.createTables();
      }).catch(e => {
        this.presentAlert('Error', 'Error al crear la base de datos: ' + JSON.stringify(e));
      });
    });
  }

  async createTables() {
    try {
      // Eliminar tablas si es necesario
      await this.database.executeSql('DROP TABLE IF EXISTS inscripciones_torneo', []);
      await this.database.executeSql('DROP TABLE IF EXISTS torneos', []);
      await this.database.executeSql('DROP TABLE IF EXISTS reservas', []);
      await this.database.executeSql('DROP TABLE IF EXISTS canchas', []);
      await this.database.executeSql('DROP TABLE IF EXISTS usuarios', []);
      await this.database.executeSql('DROP TABLE IF EXISTS roles', []);
      await this.database.executeSql('DROP TABLE IF EXISTS historial_reservas', []);

      // Crear las tablas
      await this.database.executeSql(this.tablaRoles, []);
      await this.database.executeSql(this.tablaUsuarios, []);
      await this.database.executeSql(this.tablaCanchas, []);
      await this.database.executeSql(this.tablaReservas, []);
      await this.database.executeSql(this.tablaTorneos, []);
      await this.database.executeSql(this.tablaInscripcionesTorneo, []);
      await this.database.executeSql(this.tablaHistorialReservas, []);

      // Insertar registros iniciales
      await this.database.executeSql(this.registroRoles, []);
      await this.database.executeSql(this.registroUsuarios, []);
      await this.database.executeSql(this.registroCanchas, []);

      this.isDBReady.next(true); // Indica que la base de datos está lista
    } catch (e) {
      this.presentAlert('Creación de Tablas', 'Error al crear las tablas: ' + JSON.stringify(e));
    }
  }

  // Métodos para gestionar las canchas
  seleccionarCanchas(): Promise<Cancha[]> {
    return this.database.executeSql('SELECT * FROM canchas', []).then(res => {
      let items: Cancha[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_cancha: res.rows.item(i).id_cancha,
            tipo_deporte: res.rows.item(i).tipo_deporte,
            nombre_cancha: res.rows.item(i).nombre_cancha,
            estado_cancha: res.rows.item(i).estado_cancha
          });
        }
      }
      this.listadoCanchas.next(items as any);
      return items;
    });
  }

  eliminarCancha(id: number) {
    return this.database.executeSql('DELETE FROM canchas WHERE id_cancha = ?', [id]).then(res => {
      this.presentAlert("Eliminar", "Cancha eliminada.");
      this.seleccionarCanchas();
    }).catch(e => {
      this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
    });
  }

  modificarCancha(id: number, tipo_deporte: string, nombre_cancha: string, estado_cancha: string) {
    return this.database.executeSql('UPDATE canchas SET tipo_deporte = ?, nombre_cancha = ?, estado_cancha = ? WHERE id_cancha = ?', 
      [tipo_deporte, nombre_cancha, estado_cancha, id]).then(() => {
        this.presentAlert("Modificar", "Cancha modificada.");
        this.seleccionarCanchas();
    }).catch(e => {
      this.presentAlert('Modificar', 'Error: ' + JSON.stringify(e));
    });
  }

  insertarCancha(tipo_deporte: string, nombre_cancha: string, estado_cancha: string) {
    return this.database.executeSql('INSERT INTO canchas (tipo_deporte, nombre_cancha, estado_cancha) VALUES (?, ?, ?)', 
      [tipo_deporte, nombre_cancha, estado_cancha]).then(res => {
        this.presentAlert("Insertar", "Cancha registrada.");
        this.seleccionarCanchas();
    }).catch(e => {
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
    });
  }

  // Métodos para gestionar usuarios
  seleccionarUsuarios() {
    return this.database.executeSql('SELECT * FROM usuarios', []).then(res => {
      let items: Usuario[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_usuario: res.rows.item(i).id_usuario,
            nombre: res.rows.item(i).nombre,
            id_rol: res.rows.item(i).id_rol,
            email: res.rows.item(i).email,
            contrasena: res.rows.item(i).contrasena
          });
        }
      }
      this.listadoUsuarios.next(items as any);
    });
  }

  // Registrar un nuevo usuario
  insertarUsuario(nombre: string, email: string, contrasena: string, id_rol: number = 2) {
    return this.database.executeSql(`
      INSERT INTO usuarios (nombre, email, contrasena, id_rol) 
      VALUES (?, ?, ?, ?)`, [nombre, email, contrasena, id_rol])
      .then(() => {
        this.presentAlert("Registro Exitoso", "El usuario ha sido registrado correctamente.");
        this.seleccionarUsuarios(); // Refrescar la lista de usuarios
      }).catch(e => {
        this.presentAlert("Error", "Error al registrar usuario: " + JSON.stringify(e));
      });
  }

  // Validar login del usuario
  validarUsuario(email: string, contrasena: string): Promise<Usuario | null> {
    console.log('Email:', email); // Imprime el correo
    console.log('Contraseña:', contrasena); // Imprime la contraseña

    return this.database.executeSql(`
      SELECT * FROM usuarios WHERE email = ? AND contrasena = ?`, [email, contrasena])
      .then(res => {
        if (res.rows.length > 0) {
          const usuario: Usuario = {
            id_usuario: res.rows.item(0).id_usuario,
            nombre: res.rows.item(0).nombre,
            id_rol: res.rows.item(0).id_rol,
            email: res.rows.item(0).email,
            contrasena: res.rows.item(0).contrasena
          };
          return usuario; // Retorna el usuario si es encontrado
        } else {
          console.log('Usuario no encontrado'); // Indica que no se encontró el usuario
          return null; // Usuario no encontrado
        }
      })
      .catch(e => {
        console.error('Error al validar el usuario: ', e);
        return null;
      });
}

  // Verificar si el correo ya está registrado
  verificarUsuario(email: string): Promise<boolean> {
    return this.database.executeSql(`
      SELECT * FROM usuarios WHERE email = ?`, [email])
      .then(result => {
        return result.rows.length > 0; // Retorna true si ya existe un usuario con ese correo
      });
  }

  async obtenerUsuarioPorId(id_usuario: number): Promise<Usuario | null> {
    return this.database.executeSql(`SELECT * FROM usuarios WHERE id_usuario = ?`, [id_usuario])
      .then(res => {
        if (res.rows.length > 0) {
          const usuario: Usuario = {
            id_usuario: res.rows.item(0).id_usuario,
            nombre: res.rows.item(0).nombre,
            id_rol: res.rows.item(0).id_rol,
            email: res.rows.item(0).email,
            contrasena: res.rows.item(0).contrasena
            
          };
          return usuario; // Retorna el usuario si es encontrado
        } else {
          return null; // Usuario no encontrado
        }
      })
      .catch(e => {
        console.error('Error al obtener el usuario por ID: ', e);
        return null; // Maneja errores
      });
  }

  // Método para actualizar el usuario
async actualizarUsuario(usuario: Usuario): Promise<void> {
  return this.database.executeSql(`
    UPDATE usuarios SET nombre = ?, email = ?, contrasena = ? WHERE id_usuario = ?`, 
    [usuario.nombre, usuario.email, usuario.contrasena, usuario.id_usuario])
    .then(() => {
      console.log('Usuario actualizado con éxito');
    })
    .catch(e => {
      console.error('Error al actualizar el usuario: ', e);
    });
}


  //MétoSERT INTO reservas (id_usuario, id_cancha, fecha_
  async insertarReserva(id_usuario: number, id_cancha: number, fecha_reserva: string, horario: string, estado_reserva: string, correo: string) {
    await this.database.executeSql(
        'INSERT INTO reservas (id_usuario, id_cancha, fecha_reserva, horario, estado_reserva, correo) VALUES (?, ?, ?, ?, ?, ?)',
        [id_usuario, id_cancha, fecha_reserva, horario, estado_reserva, correo]
    );
}

seleccionarReservas() {
  return this.database.executeSql('SELECT * FROM reservas', []).then(res => {
    let items: Reserva[] = [];
    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        items.push({
          id_reserva: res.rows.item(i).id_reserva,
          id_usuario: res.rows.item(i).id_usuario,
          id_cancha: res.rows.item(i).id_cancha,
          fecha_reserva: new Date(res.rows.item(i).fecha_reserva), // Asegúrate de convertir a Date si es necesario
          horario: res.rows.item(i).horario,
          estado_reserva: res.rows.item(i).estado_reserva,
          correo: res.rows.item(i).correo // Agregar el correo a la reserva
        });
      }
    }
    this.listadoReservas.next(items as any);
  });
}


    
  
  // Método para insertar una reserva en el historial
  async insertarHistorialReserva(reserva: HistorialReserva): Promise<void> {
    await this.database.executeSql(
      `INSERT INTO historial_reservas (id_reserva, id_usuario, id_cancha, fecha_reserva, estado_reserva)
       VALUES (?, ?, ?, ?, ?)`,
      [reserva.id_reserva, reserva.id_usuario, reserva.id_cancha, reserva.fecha_reserva, reserva.estado_reserva]
    );
  }
  
  async moverReservaAlHistorial(id_reserva: number) {
    try {
      // Seleccionar la reserva específica por su ID
      const res = await this.database.executeSql('SELECT * FROM reservas WHERE id_reserva = ?', [id_reserva]);
      
      if (res.rows.length > 0) {
        const reserva = res.rows.item(0);
        // Insertar la reserva en la tabla historial_reservas
        await this.database.executeSql(
          'INSERT INTO historial_reservas (id_reserva, id_usuario, id_cancha, fecha_reserva, estado_reserva) VALUES (?, ?, ?, ?, ?)',
          [reserva.id_reserva, reserva.id_usuario, reserva.id_cancha, reserva.fecha_reserva, reserva.estado_reserva]
        );
        // Eliminar la reserva de la tabla original de reservas si es necesario
        await this.database.executeSql('DELETE FROM reservas WHERE id_reserva = ?', [id_reserva]);
        
        console.log(`Reserva ${id_reserva} movida al historial correctamente.`);
      } else {
        console.error('Reserva no encontrada.');
      }
    } catch (error) {
      console.error('Error al mover reserva al historial:', error);
    }
  }
  
  async obtenerUltimoIdReserva(): Promise<number> {
    const res = await this.database.executeSql('SELECT id_reserva FROM reservas ORDER BY id_reserva DESC LIMIT 1', []);
    return res.rows.length > 0 ? res.rows.item(0).id_reserva : -1;
  }
  

async obtenerTorneos(): Promise<any[]> {
  const res = await this.database.executeSql('SELECT * FROM torneos', []);
  const torneos = [];
  for (let i = 0; i < res.rows.length; i++) {
    torneos.push(res.rows.item(i));
  }
  return torneos;
}

async obtenerTorneosPorTipoDeporte(tipoDeporte: string): Promise<any[]> {
  const res = await this.database.executeSql('SELECT * FROM torneos WHERE tipo_deporte = ?', [tipoDeporte]);
  const torneos = [];
  for (let i = 0; i < res.rows.length; i++) {
    torneos.push(res.rows.item(i));
  }
  return torneos;
}

// Método para obtener torneos por estado
async obtenerTorneosPorEstado(estado: string): Promise<any[]> {
  const res = await this.database.executeSql('SELECT * FROM torneos WHERE estado_torneo = ?', [estado]);
  const torneos = [];
  for (let i = 0; i < res.rows.length; i++) {
    torneos.push(res.rows.item(i));
  }
  return torneos;
}

// Método para insertar un nuevo torneo
async insertarTorneo(torneo: Torneo): Promise<void> {
  const sql = 'INSERT INTO torneos (nombre_torneo, descripcion, fecha_inicio, fecha_fin, tipo_deporte, estado_torneo) VALUES (?, ?, ?, ?, ?, ?)';
  await this.database.executeSql(sql, [torneo.nombre_torneo, torneo.descripcion, torneo.fecha_inicio, torneo.fecha_fin, torneo.tipo_deporte, torneo.estado_torneo]);
}


guardarReserva(reserva: Reserva) {
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]'); // Obtener las reservas existentes
  reservas.push(reserva); // Agregar la nueva reserva
  localStorage.setItem('reservas', JSON.stringify(reservas)); // Guardar nuevamente en localStorage
}

obtenerReservasPorCorreo(correo: string): Reserva[] {
  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]'); // Obtener las reservas existentes
  return reservas.filter((reserva: Reserva) => reserva.correo === correo); // Filtrar por correo
}

// Método para cargar reservas desde localStorage
cargarReservas() {
  const reservasGuardadas = localStorage.getItem('reservas');
  if (reservasGuardadas) {
    this.reservas = JSON.parse(reservasGuardadas);
  }
}

obtenerReservas(): Reserva[] {
  return this.reservas;
}


}


