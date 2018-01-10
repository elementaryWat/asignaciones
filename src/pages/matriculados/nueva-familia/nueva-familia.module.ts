import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NuevaFamiliaPage } from './nueva-familia';

@NgModule({
  declarations: [
    NuevaFamiliaPage,
  ],
  imports: [
    IonicPageModule.forChild(NuevaFamiliaPage),
  ],
})
export class NuevaFamiliaPageModule {}
