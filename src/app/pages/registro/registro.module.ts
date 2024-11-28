import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa ambos módulos
import { IonicModule } from '@ionic/angular';
import { RegisterPageRoutingModule } from './registro-routing.module';
import { RegisterPage } from './registro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Añade FormsModule aquí
    ReactiveFormsModule, // Mantén ReactiveFormsModule si lo necesitas
    IonicModule,
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPage]
})
export class RegistroPageModule {}
