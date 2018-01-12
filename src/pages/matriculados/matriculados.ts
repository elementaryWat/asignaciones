import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import {NuevaFamiliaPage} from './nueva-familia/nueva-familia';
import {NuevoHermanoPage} from './nuevo-hermano/nuevo-hermano';
/**
 * Generated class for the MatriculadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-matriculados',
  templateUrl: 'matriculados.html',
})
export class MatriculadosPage {

  constructor(public modalCtrl:ModalController) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad MatriculadosPage');
  // }
  presentModalFamily() {
      let modal = this.modalCtrl.create(NuevaFamiliaPage);
      modal.present();
  }
  presentModalHermano() {
      let modal = this.modalCtrl.create(NuevoHermanoPage);
      modal.present();
  }
}
