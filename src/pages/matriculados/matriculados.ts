import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import {NuevaFamiliaPage} from './nueva-familia/nueva-familia';
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
}
