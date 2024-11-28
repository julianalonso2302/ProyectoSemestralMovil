import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BDserviceService } from 'src/app/services/bdservice.service';
import { Usuario } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private serviceBD: BDserviceService 
  ) {
    // Inicializa el formulario con validaciones
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]], // Validación de correo
      contraseña: ['', Validators.required], // Validación de contraseña
    });
  }

  ngOnInit() {}

  // Método para mostrar alertas
  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Método para iniciar sesión
  async onLogin() {
    if (this.loginForm.valid) {
      const { correo, contraseña } = this.loginForm.value;

      // Verifica los valores que se están enviando
      console.log('Correo:', correo, 'Contraseña:', contraseña);
  
      // Validar el usuario en la base de datos
      const usuario: Usuario | null = await this.serviceBD.validarUsuario(correo, contraseña);
  
      if (usuario) {
        // Guardar el ID del usuario y su rol en el localStorage
        localStorage.setItem('userId', usuario.id_usuario.toString()); 
        localStorage.setItem('rolId', usuario.id_rol.toString()); 

        // Redirigir según el rol del usuario
        if (usuario.id_rol === 1) {
          this.router.navigate(['/admin']);
        } else if (usuario.id_rol === 2) {
          this.router.navigate(['/principal']);
        }

        // Reiniciar el formulario después de iniciar sesión
        this.loginForm.reset();
      } else {
        // Mostrar alerta si el inicio de sesión falla
        this.presentAlert('Login Fallido', 'Correo o contraseña incorrectos.');
      }
    } else {
      // Mostrar alerta si el formulario no está completo o tiene errores
      this.presentAlert('Formulario Incompleto', 'Por favor, completa todos los campos correctamente.');
    }
  }
}
