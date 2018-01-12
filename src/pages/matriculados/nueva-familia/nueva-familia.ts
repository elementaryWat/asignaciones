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
import {Observable} from 'rxjs/Observable';
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
  showFamilias:boolean=false;
  familias:Familia[]=[];
  familia:Familia;
  toast:Toast;
  loader:Loading;
  constructor(private viewCtrl:ViewController,
              private firestoreHProvider:FirestoreHermanosProvider,
              private authProvider:AuthProvider,
              private toastCtrl:ToastController,
              private loadingCtrl:LoadingController) {
        this.firestoreHProvider.obtenerFamilias().subscribe(familias=>{
          this.familias=familias;
        });
        this.familia={
          apellido:'',
          domicilio:'',
          congregacion:this.authProvider.currentUser.congregacion
        };
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad NuevaFamiliaPage');
  // }
  dismiss() {
   this.viewCtrl.dismiss();
 }
 agregarFamilia(formNewFamily:NgForm,context:NuevaFamiliaPage){
   //console.log(formNewFamily);
   this.presentLoading();
   let suscripcionAddF=this.firestoreHProvider.verificarExistencia(this.familia).subscribe(familias=>{
        if(familias.length==0){
          this.firestoreHProvider.agregarFamilia(this.familia).then(()=>{
            this.familia.apellido="";
            this.familia.domicilio="";
            this.loader.dismiss();
            context.presentToast("Se agrego la familia de manera exitosa");
          });
        }else{
          this.loader.dismiss();
          context.presentToast("Ya existe una familia con este apellido. Para evitar conflictos agregue al apellido la/s primera/s letras/s del nombre de un integrante");
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
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Por favor espere..."
    });
    this.loader.present();
  }
  ionViewDidLeave(){
    if (this.toast){
      this.toast.dismiss();
    }
  }
}
