import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TorneosPageRoutingModule } from './torneos-routing.module';
import { TorneosPage } from './torneos.page';

import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    TorneosPageRoutingModule,
    
  ],
  declarations: [TorneosPage]
})
export class TorneosPageModule {}
