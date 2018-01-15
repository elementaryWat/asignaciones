import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import { IonicPage,
         NavParams,
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
  formHermano:FormGroup;
  cambioF:boolean=false;
  operacion:string;
  hermano:Hermano;
  familias:Familia[];
  suscripcion:Subscription;
  loader:Loading;
  toast:Toast;
  constructor(private navParams:NavParams,
              private viewCtrl:ViewController,
              private firestoreHProvider:FirestoreHermanosProvider,
              private loadingCtrl:LoadingController,
              private toastCtrl:ToastController) {
      this.operacion=navParams.get("operacion");
      console.log(this.operacion);
      switch(this.operacion){
          case 'create':
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
            break;
          case 'update':
            this.hermano=navParams.get("hermano");
            break;
        }

        this.suscripcion=this.firestoreHProvider.obtenerFamilias().subscribe(familias=>{
          this.familias=familias;
        });
        this.crearForm();
  }
  crearForm(){
    this.formHermano=new FormGroup({
      'familia':new FormControl('',Validators.required),
      'hid':new FormControl(''),
      'nombre':new FormControl('',Validators.required),
      'telefono':new FormControl(''),
      'publicador':new FormControl(''),
      'bautizado':new FormControl(''),
      'precursorRegular':new FormControl(''),
      'siervoMinisterial':new FormControl(''),
      'anciano':new FormControl(''),
    });
    this.formHermano.patchValue(this.hermano);
    let valorI=this.formHermano.value;
    this.formHermano.valueChanges.subscribe(()=>{
      this.cambioF=JSON.stringify(this.formHermano.value)!=JSON.stringify(valorI);
    });
  }
  dismiss() {
   this.viewCtrl.dismiss();
 }
 agregarHermano(){
   this.presentLoading("Agregando hermano...");
   let suscripcionAddH=this.firestoreHProvider.verificarExistenciaHermano(this.formHermano.value).subscribe(hermanos=>{
        if(hermanos.length==0){
            this.firestoreHProvider.agregarHermano(this.formHermano.value).then((docRef)=>{
              this.firestoreHProvider.configHermanoyFamilia(docRef.id,this.formHermano.value.familia).then(()=>{
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
                this.formHermano.patchValue(this.hermano);
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
 actualizarHermano(){
   // console.log(this.formHermano);
   this.presentLoading(`Actualizando datos ${this.hermano.nombre}...`);
   this.firestoreHProvider.actualizarHermano(this.formHermano.value)
                          .then(()=>{
                            this.cambioF=false;
                            this.loader.dismiss();
                            this.presentToast(`Se actualizaron los datos de ${this.hermano.nombre} de manera correcta`);
                          })
                          .catch((error)=>{
                            this.loader.dismiss();
                            this.presentToast("Ha ocurrido un error: "+error);
                          });
 }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad NuevoHermanoPage');
  // }
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
  setAFalsoP(){
    if(!this.formHermano.controls['publicador'].value){
      this.formHermano.controls['bautizado'].setValue(false);
      this.formHermano.controls['precursorRegular'].setValue(false);
      this.formHermano.controls['siervoMinisterial'].setValue(false);
      this.formHermano.controls['anciano'].setValue(false);
    }
  }
  setAFalsoB(){
    if(!this.formHermano.controls['bautizado'].value){
      this.formHermano.controls['precursorRegular'].setValue(false);
      this.formHermano.controls['siervoMinisterial'].setValue(false);
      this.formHermano.controls['anciano'].setValue(false);
    }
  }
  setAFalsoS(){
    if(this.formHermano.controls['siervoMinisterial'].value){
      this.formHermano.controls['anciano'].setValue(false);
    }
  }
  setAFalsoA(){
    if(this.formHermano.controls['anciano'].value){
      this.formHermano.controls['siervoMinisterial'].setValue(false);
    }
  }
  ionViewWillUnload(){
    if (this.toast){
      this.toast.dismiss();
    }
    this.suscripcion.unsubscribe();
  }
}
