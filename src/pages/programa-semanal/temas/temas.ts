import { Component } from '@angular/core';
import { IonicPage,
        NavController,
        AlertController,
        ToastController,
        Toast,
        LoadingController,
        Loading} from 'ionic-angular';
import {Tema} from '../../../app/interfaces/tema.interface';
import {FirestoreTemasProvider} from '../../../providers/firestore-temas/firestore-temas';
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
  temas:Tema[];
  loading:boolean=true;
  loader:Loading;
  toast:Toast;
  constructor(public navCtrl: NavController,
              private firestoreTProvider:FirestoreTemasProvider,
              private alertCtrl:AlertController,
              private toastCtrl:ToastController,
              private loadingCtrl:LoadingController) {
    this.presentLoading("Cargando temas...");
    this.firestoreTProvider.obtenerTemas().subscribe(temas=>{
      this.temas=temas;
      if (this.loading){
        this.loader.dismiss();
        this.loading=false;
      }
    });
  }
  irANuevoTema(){
    this.navCtrl.push(TemaPage,{
      'operacion':'create'
    });
  }
  cargarTema(tema:Tema){
    this.navCtrl.push(TemaPage,{
      'operacion':'update',
      'tema':tema
    });
  }
  confirmarEliminar(tema:Tema){
   let confirm = this.alertCtrl.create({
     title: '¿Eliminar tema?',
     message: `¿Esta seguro de que desea eliminar el tema ${tema.nombre}?`,
     buttons: [
       {
         text: 'NO'
       },
       {
         text: 'Si',
         handler: () => {
          this.eliminarTema(tema);
         }
       }
     ]
   });
   confirm.present();
 }
async eliminarTema(tema:Tema) {
    this.presentLoading("Eliminando tema...");
    try {
        await this.firestoreTProvider.eliminarTema(tema);
        this.loader.dismiss();
        this.presentToast("Se eliminó el tema de manera exitosa");
    }
    catch(err) {
      this.loader.dismiss();
      this.presentToast("Ha ocurrido un error al actualizar: "+err);
    }
}
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad Asignaciones Page');
  // }
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
