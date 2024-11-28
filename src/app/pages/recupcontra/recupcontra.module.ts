import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecupcontraPageRoutingModule } from './recupcontra-routing.module';

import { RecupcontraPage } from './recupcontra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecupcontraPageRoutingModule
  ],
  declarations: [RecupcontraPage]
})
export class RecupcontraPageModule {}
