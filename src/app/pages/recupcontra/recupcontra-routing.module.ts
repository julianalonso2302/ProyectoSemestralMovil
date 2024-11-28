import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecupcontraPage } from './recupcontra.page';

const routes: Routes = [
  {
    path: '',
    component: RecupcontraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecupcontraPageRoutingModule {}
