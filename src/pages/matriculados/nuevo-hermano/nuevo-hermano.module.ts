import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NuevoHermanoPage } from './nuevo-hermano';

@NgModule({
  declarations: [
    NuevoHermanoPage,
  ],
  imports: [
    IonicPageModule.forChild(NuevoHermanoPage),
  ],
})
export class NuevoHermanoPageModule {}
