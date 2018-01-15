import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
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
  formAsignacion:FormGroup;
  cambioF:boolean;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
        this.crearForm();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad Asignaciones Page');
  // }
  crearForm(){
    this.formAsignacion=new FormGroup({
      'tipo':new FormControl('',Validators.required),
      'ayudante':new FormControl(''),
      'tituloSecundario':new FormControl(''),
      'duracionFija':new FormControl(''),
      'duracion':new FormControl(''),
      'siervosNombrados':new FormControl(''),
      'ancianos':new FormControl('')
    });
    // this.formAsignacion.patchValue(this.asignacion);
    // let valorI=this.formAsignacion.value;
    // this.formAsignacion.valueChanges.subscribe(()=>{
    //   this.cambioF=JSON.stringify(this.formAsignacion.value)!=JSON.stringify(valorI);
    // });
  }
  agregarTema(){
    console.log(this.formAsignacion);
  }
}
