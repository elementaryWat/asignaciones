import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TemaPage} from '../tema/tema';
/**
 * Generated class for the AsignacionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-temas',
  templateUrl: 'temas.html',
})
export class TemasPage {
  constructor(public navCtrl: NavController) {
  }
  irANuevoTema(){
    this.navCtrl.push(TemaPage);
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad Asignaciones Page');
  // }
}
