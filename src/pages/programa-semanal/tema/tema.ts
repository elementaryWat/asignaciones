import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import {Tema} from '../../../app/interfaces/tema.interface';
/**
 * Generated class for the TemaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tema',
  templateUrl: 'tema.html',
})
export class TemaPage {
  formAsignacion:FormGroup;
  cambioF:boolean;
  tema:Tema;
  constructor() {
    this.tema={
      tipo:'otra',
      nombre:'',
      ayudante:false,
      tituloSecundario:false,
      duracionFija:true,
      duracion:5,
      siervosNombrados:true,
      ancianos:false
    };
    this.crearForm();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad TemaPage');
  // }
  crearForm(){
    this.formAsignacion=new FormGroup({
      'tipo':new FormControl('',Validators.required),
      'nombre':new FormControl('',Validators.required),
      'ayudante':new FormControl(''),
      'tituloSecundario':new FormControl(''),
      'duracionFija':new FormControl(''),
      'duracion':new FormControl(''),
      'siervosNombrados':new FormControl(''),
      'ancianos':new FormControl('')
    });
    this.formAsignacion.patchValue(this.tema);
    // let valorI=this.formAsignacion.value;
    // this.formAsignacion.valueChanges.subscribe(()=>{
    //   this.cambioF=JSON.stringify(this.formAsignacion.value)!=JSON.stringify(valorI);
    // });
  }
  establecerTipo(){

  }
  agregarTema(){
    console.log(this.formAsignacion);
  }
}
