import { Component } from '@angular/core';
import { IonicPage, NavParams,
          ToastController,
          Toast,
          LoadingController,
          Loading} from 'ionic-angular';
import {Hermano} from '../../app/interfaces/hermano.interface';
import {Usuario} from '../../app/clases/User.class';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {FirestoreHermanosProvider} from '../../providers/firestore-hermanos/firestore-hermanos';

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
  valorI:string;
  cambioF:boolean;
  toast:Toast;
  loader:Loading;
  constructor( private navParams: NavParams,
              private firestoreHProvider:FirestoreHermanosProvider,
              private loadingCtrl:LoadingController,
              private toastCtrl:ToastController) {
    this.operacion=navParams.get('operacion');
    switch(this.operacion){
      case 'create':
        this.hermano=navParams.get('hermano');
        this.userN={
          hid:this.hermano.hid,
          nombre:this.hermano.nombre,
          congregacion:this.hermano.congregacion,
          administrador:false,
          email:'',
          contraseña:''
        }
        this.crearForm();
        this.setValueForm(this.userN);
        break;
      case 'update':
        let idUser=navParams.get('usuario');
        this.crearForm();
        let susc=this.firestoreHProvider.obtenerUsuario(idUser).subscribe(usuario=>{
          this.setValueForm(usuario);
          susc.unsubscribe();
        });
        break;
    }

  }
  crearForm(){
    this.formUsuario=new FormGroup({
      'email':new FormControl('',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]),
      'contraseña':new FormControl('',Validators.required),
      'uid':new FormControl(''),
      'hid':new FormControl(''),
      'administrador':new FormControl(''),
      'nombre':new FormControl('',Validators.required),
      'congregacion':new FormControl('',Validators.required),
    });
  }
  setValueForm(value:Usuario){
    this.formUsuario.patchValue(value);
    this.valorI=this.formUsuario.value;
    this.formUsuario.valueChanges.subscribe(()=>{
      this.cambioF=JSON.stringify(this.formUsuario.value)!=JSON.stringify(this.valorI);
    });
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad UsuarioPage');
  // }
  async agregarUsuario(){
    this.presentLoading(`Agregando usuario para ${this.formUsuario.controls['nombre'].value}...`);
    try {
      await this.firestoreHProvider.agregarUsuario(this.formUsuario.value);
      this.valorI=this.formUsuario.value;
      this.operacion='update';
      this.cambioF=false;
      this.loader.dismiss();
      this.presentToast('Se ha agregado el usuario de manera correcta');
    }
    catch(err){
      this.loader.dismiss();
      this.presentToast('Ha ocurrido un error al agregar el usuario: '+err);
    }
  }
  async editarUsuario(){
    this.presentLoading(`Actualizando datos de ${this.formUsuario.controls['nombre'].value}...`);
    try {
      await this.firestoreHProvider.actualizarUsuario(this.formUsuario.value);
      this.valorI=this.formUsuario.value;
      this.cambioF=false;
      this.loader.dismiss();
      this.presentToast('Se han actualizado los datos de manera correcta');
    }
    catch(err){
      this.loader.dismiss();
      this.presentToast('Ha ocurrido un error al actualizar los datos: '+err);
    }
  }
  presentLoading(mensaje:string) {
    this.loader = this.loadingCtrl.create({
      content: mensaje
    });
    this.loader.present();
  }
  presentToast(mensaje:string) {
    if (this.toast){
      this.toast.dismiss();
    }
    this.toast = this.toastCtrl.create({
        message: mensaje,
        position: 'bottom',
        showCloseButton:true,
        closeButtonText:"OK"
      });
     this.toast.present();
   }
  ionViewWillUnload(){
    if (this.toast){
      this.toast.dismiss();
    }
  }
}
