import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import {Hermano} from '../../app/interfaces/hermano.interface';
import {Usuario} from '../../app/clases/User.class';
import {FormGroup, FormControl, Validators} from '@angular/forms';


/**
 * Generated class for the UsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {
  hermano:Hermano;
  operacion:string;
  userN:Usuario;
  formUsuario:FormGroup;
  constructor( private navParams: NavParams) {
    this.hermano=navParams.get('hermano');
    this.operacion=navParams.get('operacion');
    this.userN={
      nombre:this.hermano.nombre,
      congregacion:this.hermano.congregacion,
      email:'',
      contraseña:''
    }
    this.crearForm();
  }
  crearForm(){
    this.formUsuario=new FormGroup({
      'email':new FormControl('',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]),
      'password':new FormControl('',Validators.required),
      'uid':new FormControl(''),
      'administrador':new FormControl(''),
      'nombre':new FormControl('',Validators.required),
      'congregacion':new FormControl('',Validators.required),
    });
    this.formUsuario.patchValue(this.userN);
    // this.valorI=this.formHermano.value;
    // this.formHermano.valueChanges.subscribe(()=>{
    //   this.cambioF=JSON.stringify(this.formHermano.value)!=JSON.stringify(this.valorI);
    // });
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad UsuarioPage');
  // }
  agregarUsuario(){

  }
}
