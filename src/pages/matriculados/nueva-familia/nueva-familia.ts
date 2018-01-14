import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage,
          NavController,
          NavParams,
          ViewController,
          ToastController,
          Toast,
          LoadingController,
          Loading} from 'ionic-angular';
import {FirestoreHermanosProvider} from '../../../providers/firestore-hermanos/firestore-hermanos';
import {AuthProvider} from '../../../providers/auth/auth';
import {Subscription} from 'rxjs/Subscription';
import {Familia} from '../../../app/interfaces/familia.interface';
/**
 * Generated class for the NuevaFamiliaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nueva-familia',
  templateUrl: 'nueva-familia.html',
})

export class NuevaFamiliaPage {
  familias:Familia[]=[];
  familia:Familia;
  toast:Toast;
  loader:Loading;
  suscripcion:Subscription;
  constructor(private viewCtrl:ViewController,
              private firestoreHProvider:FirestoreHermanosProvider,
              private authProvider:AuthProvider,
              private toastCtrl:ToastController,
              private loadingCtrl:LoadingController) {
        this.suscripcion=this.firestoreHProvider.obtenerFamilias().subscribe(familias=>{
          this.familias=familias;
        });
        this.familia={
          apellido:'',
          domicilio:'',
          congregacion:this.authProvider.currentUser.congregacion,
          tieneintegrantes:false
        };
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad NuevaFamiliaPage');
  // }
  dismiss() {
   this.viewCtrl.dismiss();
 }
 agregarFamilia(formNewFamily:NgForm){
   //console.log(formNewFamily);
   this.presentLoading("Agregando familia...");
   let suscripcionAddF=this.firestoreHProvider.verificarExistenciaFamilia(this.familia).subscribe(familias=>{
        if(familias.length==0){
            this.firestoreHProvider.agregarFamilia(this.familia).then((docRef)=>{
              this.firestoreHProvider.actualizarFid(docRef).then(()=>{
                this.familia.apellido="";
                this.familia.domicilio="";
                this.loader.dismiss();
                this.presentToast("Se agrego la familia de manera exitosa");
              }).catch(error=>{
                this.loader.dismiss();
                this.presentToast("No se ha completado la insercion de la familia correctamente. Eliminela y vuelva a agregarla para evitar inconvenientes en el futuro");
              });
          }).catch(error=>{
            this.loader.dismiss();
            this.presentToast("Ha ocurrido un error: "+ error);
          });
        }else{
          this.loader.dismiss();
          this.presentToast("Ya existe una familia con este apellido. Para evitar conflictos agregue al apellido la/s primera/s letras/s del nombre de un integrante");
        }
        suscripcionAddF.unsubscribe();
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
  ionViewWillUnload(){
    if (this.toast){
      this.toast.dismiss();
    }
    this.suscripcion.unsubscribe();
  }
}
