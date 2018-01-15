import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TemaPage } from './tema';

@NgModule({
  declarations: [
    TemaPage,
  ],
  imports: [
    IonicPageModule.forChild(TemaPage),
  ],
})
export class TemaPageModule {}
