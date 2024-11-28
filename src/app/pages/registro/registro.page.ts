import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { BDserviceService } from 'src/app/services/bdservice.service'; // Servicio para interactuar con la BD

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegisterPage implements OnInit {
  nombre: string = "";
  apellido: string = "";
  id_rol: number = 2; // El rol por defecto es 'Usuario'
  correo: string = "";
  contrasena: string = "";

  constructor(
    private bd: BDserviceService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  // Validar correo electrónico
  validarEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  }

  // Validar formulario y mostrar alertas si es necesario
  async registrarUsuario() {
    // Verificar que todos los campos estén completos
    if (!this.nombre || !this.apellido || !this.correo || !this.contrasena) {
      this.presentAlert('Campos incompletos', 'Por favor, complete todos los campos.');
      return;
    }

    // Verificar que el nombre y el apellido solo contengan letras
    const nombreRegex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    if (!nombreRegex.test(this.nombre)) {
      this.presentAlert('Nombre inválido', 'El nombre solo debe contener letras, espacios y guiones.');
      return;
    }

    if (!nombreRegex.test(this.apellido)) {
      this.presentAlert('Apellido inválido', 'El apellido solo debe contener letras, espacios y guiones.');
      return;
    }

    // Validar correo electrónico
    if (!this.validarEmail(this.correo)) {
      this.presentAlert('Correo inválido', 'Por favor, ingrese un correo electrónico válido.');
      return;
    }

    // Validar que la contraseña tenga al menos 8 caracteres
    if (this.contrasena.length < 8) {
      this.presentAlert('Contraseña corta', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Verificar si el usuario ya existe
    const existeUsuario = await this.verificarUsuarioExistente();
    if (existeUsuario) {
      this.presentAlert('Usuario existente', 'El usuario ya está registrado con ese correo.');
      return;
    }

    // Si pasa todas las validaciones y no existe, proceder con el registro
    await this.onSubmit();
  }

  async verificarUsuarioExistente(): Promise<boolean> {
    const usuarioExistente = await this.bd.verificarUsuario(this.correo);
    return usuarioExistente; 
  }

  async onSubmit() {
    try {
      await this.insertarUsuario();

      const toast = await this.toastController.create({
        message: 'Usuario registrado con éxito',
        color: 'success',
        duration: 2000
      });
      toast.present();

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      this.presentAlert('Error', 'Hubo un problema al registrar el usuario. Inténtalo nuevamente.');
    }
  }

  // Insertar el nuevo usuario
  insertarUsuario() {
    return this.bd.insertarUsuario(this.nombre, this.correo, this.contrasena, this.id_rol);
  }

  // Mostrar alertas
  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
