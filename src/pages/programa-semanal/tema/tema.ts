import { Component } from '@angular/core';
import { IonicPage,
         NavController,
         NavParams,
         LoadingController,
         Loading,
         ToastController,
         Toast} from 'ionic-angular';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Tema} from '../../../app/interfaces/tema.interface';
import {reuniones} from '../../../app/consts/reuniones.const';
import {FirestoreTemasProvider} from '../../../providers/firestore-temas/firestore-temas';

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
  formTema:FormGroup;
  cambioF:boolean;
  tema:Tema;
  toast:Toast;
  loader:Loading;
  operacion:string;
  REUNIONES=reuniones;
  valorI:string;
  constructor(private firestoreTProvider:FirestoreTemasProvider,
              private loadingCtrl:LoadingController,
              private toastCtrl:ToastController,
              private navParams:NavParams) {
    this.operacion=this.navParams.get("operacion");
    switch(this.operacion){
      case 'create':
        this.tema={
          tipo:'otra',
          reunion:'tesoros',
          default:false,
          nombre:'',
          ayudante:false,
          tituloSecundario:false,
          observaciones:false,
          duracionFija:true,
          duracion:5,
          siervosNombrados:false,
          ancianos:false
        };
        break;
      case 'update':
        this.tema=this.navParams.get('tema');
        break;
    }
    this.crearForm();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad TemaPage');
  // }
  crearForm(){
    this.formTema=new FormGroup({
      'tid':new FormControl(''),
      'reunion':new FormControl('',Validators.required),
      'default':new FormControl(''),
      'tipo':new FormControl(''),
      'nombre':new FormControl('',Validators.required),
      'ayudante':new FormControl(''),
      'tituloSecundario':new FormControl(''),
      'observaciones':new FormControl(''),
      'duracionFija':new FormControl(''),
      'duracion':new FormControl(''),
      'siervosNombrados':new FormControl(''),
      'ancianos':new FormControl('')
    });
    this.formTema.patchValue(this.tema);
    this.valorI=this.formTema.value;
    this.formTema.valueChanges.subscribe(()=>{
      this.cambioF=JSON.stringify(this.formTema.value)!=JSON.stringify(this.valorI);
    });
    this.formTema.controls['reunion'].valueChanges.subscribe(value=>{
      if(value=="vidacristiana"){
        this.formTema.controls['tipo'].setValue('otra');
      }
    });
    this.formTema.controls['tipo'].valueChanges.subscribe(value=>{
      if(value=="estudiantil"){
        this.formTema.controls['siervosNombrados'].setValue(false);
        this.formTema.controls['ancianos'].setValue(false);
      }
    });
    this.formTema.controls['siervosNombrados'].valueChanges.subscribe(value=>{
      if(!value){
        this.formTema.controls['ancianos'].setValue(false);
      }
    });
  }
  establecerTipo(){

  }
  agregarTema(){
    this.presentLoading("Agregando tema...");
    this.firestoreTProvider.agregarTema(this.formTema.value).then((docRef)=>{
      this.firestoreTProvider.actualizarTid(docRef).then(()=>{
        this.loader.dismiss();
        this.presentToast("Se agrego el tema de manera exitosa");
      }).catch((error)=>{
        this.loader.dismiss();
        this.presentToast(`Ha ocurrido un error: ${error}. Elimine el tema y agreguelo de vuelta`);
      });
    })
    .catch(error=>{
      this.loader.dismiss();
      this.presentToast("Ha ocurrido un error al agregar: "+error);
    });
  }
  actualizarTema(){
    this.presentLoading("Actualizando tema...");
    this.firestoreTProvider.actualizarTema(this.formTema.value).then(()=>{
                              this.valorI=this.formTema.value;
                              this.cambioF=false;
                              this.loader.dismiss();
                              this.presentToast("Se actualizó el tema de manera exitosa");
                            }).catch((error)=>{
                              this.loader.dismiss();
                              this.presentToast("Ha ocurrido un error al actualizar: "+error);
                            });
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
   presentLoading(mensaje:string) {
     this.loader = this.loadingCtrl.create({
       content: mensaje
     });
     this.loader.present();
   }
   ionViewDidLeave(){
     if (this.toast){
       this.toast.dismiss();
     }
   }
}
