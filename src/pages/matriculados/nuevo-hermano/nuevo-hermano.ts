import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, ViewController } from 'ionic-angular';
import {FirestoreHermanosProvider} from '../../../providers/firestore-hermanos/firestore-hermanos';
import {Hermano} from '../../../app/interfaces/hermano.interface';
import {Familia} from '../../../app/interfaces/familia.interface';

/**
 * Generated class for the NuevoHermanoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nuevo-hermano',
  templateUrl: 'nuevo-hermano.html',
})
export class NuevoHermanoPage {
  hermano:Hermano;
  familias:Familia[];
  constructor(private viewCtrl:ViewController,
              private firestoreHProvider:FirestoreHermanosProvider) {
        this.hermano={
          nombre:'',
          userId:'',
          fechaNacimiento:'',
          telefono:null,
          familia:'',
          publicador:true,
          bautizado:true,
          precursorRegular:false,
          siervoMinisterial:false,
          anciano:false
        };
        this.firestoreHProvider.obtenerFamilias().subscribe(familias=>{
          this.familias=familias;
        });
  }
  dismiss() {
   this.viewCtrl.dismiss();
 }
 agregarHermano(formNewHermano:NgForm){
   console.log(formNewHermano);
 }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad NuevoHermanoPage');
  // }

}
