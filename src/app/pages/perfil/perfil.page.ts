import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/services/usuario.service'; 
import { BDserviceService } from 'src/app/services/bdservice.service';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  Usuario: any = {
    nombre: '',
    email: '',
    contrasena: '',
    foto: ''
  };
  editando: boolean = false;
  imagen: string = '';

  constructor(
    private usuarioService: BDserviceService,
    private router: Router,
    private camera: Camera,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.Usuario = await this.usuarioService.obtenerUsuarioPorId(parseInt(userId));
      if (this.Usuario.foto) {
        this.imagen = this.Usuario.foto;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Método para tomar o seleccionar una foto
  async selectPhoto(sourceType: number) {
    if (!this.platform.is('cordova')) {
      console.log('La cámara solo funciona en dispositivos móviles.');
      return;
    }

    const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType // 0: Cámara, 1: Galería
    };

    try {
      const imageData = await this.camera.getPicture(options);
      this.imagen = 'data:image/jpeg;base64,' + imageData;
      this.Usuario.foto = this.imagen;
    } catch (error) {
      console.error('Error al seleccionar la foto:', error);
    }
  }

  // Método para tomar una foto
  takePicture() {
    this.selectPhoto(0); // 0 para tomar foto
  }

  // Método para seleccionar una foto de la galería
  selectFromGallery() {
    this.selectPhoto(1); // 1 para seleccionar de la galería
  }

  toggleEdicion() {
    this.editando = !this.editando;
  }

  async guardarCambios() {
    if (this.Usuario) {
      await this.usuarioService.actualizarUsuario(this.Usuario);
      this.editando = false;
    }
  }
}
