import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisAsignacionesPage } from './mis-asignaciones';

@NgModule({
  declarations: [
    MisAsignacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(MisAsignacionesPage),
  ],
})
export class MisAsignacionesPageModule {}
