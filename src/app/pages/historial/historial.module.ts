import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialPageRoutingModule } from './historial-routing.module';

import { HistorialPage } from './historial.page';
import { RouterModule } from '@angular/router';
import { FutbolitoService } from 'src/app/services/futbolito.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: HistorialPage }]),
    HistorialPageRoutingModule
   ],
  declarations: [HistorialPage],
  providers: [FutbolitoService], // Agrega aquí tu servicio
})
export class HistorialPageModule {}
