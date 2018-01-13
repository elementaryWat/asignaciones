import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage,
         ViewController,
         LoadingController,
         Loading,
         ToastController,
         Toast } from 'ionic-angular';
import {FirestoreHermanosProvider} from '../../../providers/firestore-hermanos/firestore-hermanos';
import {Hermano} from '../../../app/interfaces/hermano.interface';
import {Familia} from '../../../app/interfaces/familia.interface';
import {Subscription} from 'rxjs/Subscription';

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
  suscripcion:Subscription;
  loader:Loading;
  toast:Toast;
  constructor(private viewCtrl:ViewController,
              private firestoreHProvider:FirestoreHermanosProvider,
              private loadingCtrl:LoadingController,
              private toastCtrl:ToastController) {
        this.hermano={
          nombre:'',
          userId:'',
          fechaNacimiento:'',
          telefono:'',
          familia:'',
          publicador:true,
          bautizado:true,
          precursorRegular:false,
          siervoMinisterial:false,
          anciano:false
        };
        this.suscripcion=this.firestoreHProvider.obtenerFamilias().subscribe(familias=>{
          this.familias=familias;
        });
  }
  dismiss() {
   this.viewCtrl.dismiss();
 }
 agregarHermano(formNewHermano:NgForm){
   //console.log(formNewFamily);
   this.presentLoading();
   let suscripcionAddH=this.firestoreHProvider.verificarExistenciaHermano(this.hermano).subscribe(familias=>{
        if(familias.length==0){
            this.firestoreHProvider.agregarHermano(this.hermano).then((docRef)=>{
              this.firestoreHProvider.configHermanoyFamilia(docRef.id,this.hermano.familia).then(()=>{
                this.hermano={
                  nombre:'',
                  userId:'',
                  fechaNacimiento:'',
                  telefono:'',
                  familia:'',
                  publicador:true,
                  bautizado:true,
                  precursorRegular:false,
                  siervoMinisterial:false,
                  anciano:false
                };
                this.loader.dismiss();
                this.presentToast("Se agrego el hermano de manera exitosa");
              }).catch(error=>{
                this.loader.dismiss();
                this.presentToast("No se ha completado la insercion del hermano correctamente. Eliminelo y vuelva a agregarlo para evitar inconvenientes en el futuro");
              });
          }).catch(error=>{
            this.loader.dismiss();
            this.presentToast("Ha ocurrido un error: "+ error);
          });
        }else{
          this.loader.dismiss();
          this.presentToast("Ya existe un integrante con el mismo nombre en esta familia");
        }
        suscripcionAddH.unsubscribe();
   });
 }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad NuevoHermanoPage');
  // }
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Por favor espere..."
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
  setAFalsoP(){
    if(!this.hermano.publicador){
      this.hermano.bautizado=false;
      this.hermano.precursorRegular=false;
      this.hermano.siervoMinisterial=false;
      this.hermano.anciano=false;
    }
  }
  setAFalsoB(){
    if(!this.hermano.bautizado){
      this.hermano.precursorRegular=false;
      this.hermano.siervoMinisterial=false;
      this.hermano.anciano=false;
    }
  }
  setAFalsoS(){
    if(this.hermano.siervoMinisterial){
      this.hermano.anciano=false;
    }
  }
  setAFalsoA(){
    if(this.hermano.anciano){
      this.hermano.siervoMinisterial=false;
    }
  }
  ionViewWillUnload(){
    if (this.toast){
      this.toast.dismiss();
    }
    this.suscripcion.unsubscribe();
  }
}
