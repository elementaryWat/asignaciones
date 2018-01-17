import { Component, ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import { IonicPage,
          Content,
          NavController,
          NavParams,
          ViewController,
          AlertController,
          ToastController,
          Toast,
          LoadingController,
          Loading} from 'ionic-angular';
import {FirestoreHermanosProvider} from '../../../providers/firestore-hermanos/firestore-hermanos';
import {AuthProvider} from '../../../providers/auth/auth';
import {Subscription} from 'rxjs/Subscription';
import {Familia} from '../../../app/interfaces/familia.interface';
import {Hermano} from '../../../app/interfaces/hermano.interface';
/**
 * Generated class for the NuevaFamiliaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-familia',
  templateUrl: 'familia.html',
})

export class FamiliaPage {
  familias:Familia[]=[];
  familia:Familia;
  toast:Toast;
  loader:Loading;
  suscripcion:Subscription;
  formFamilia:FormGroup;
  operacion:string;
  congreg:string;
  cambioF:boolean;
  @ViewChild(Content) content: Content;
  constructor(private viewCtrl:ViewController,
              private firestoreHProvider:FirestoreHermanosProvider,
              private authProvider:AuthProvider,
              private toastCtrl:ToastController,
              private alertCtrl:AlertController,
              private loadingCtrl:LoadingController) {
        this.suscripcion=this.firestoreHProvider.obtenerFamilias().subscribe(familias=>{
          this.familias=familias;
        });
        this.operacion="create";
        this.familia={
          apellido:'',
          domicilio:'',
          telefono:'',
          congregacion:this.authProvider.currentUser.congregacion,
          tieneintegrantes:false
        };
        this.authProvider.obtenerDetallesCong().subscribe(cong=>this.congreg=cong[0].nombre);
        this.crearForm();
  }
  crearForm(){
    this.formFamilia=new FormGroup({
      'apellido':new FormControl('',Validators.required),
      'congregacion':new FormControl('',Validators.required),
      'fid':new FormControl(''),
      'domicilio':new FormControl('',Validators.required),
      'telefono':new FormControl(''),
    });
    this.formFamilia.patchValue(this.familia);
    let valorI=this.formFamilia.value;
    this.formFamilia.valueChanges.subscribe(()=>{
      this.cambioF=JSON.stringify(this.formFamilia.value)!=JSON.stringify(valorI);
    });
  }
  resetForm(){
    this.operacion="create";
    this.formFamilia.patchValue(this.familia);
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad NuevaFamiliaPage');
  // }
  dismiss() {
   this.viewCtrl.dismiss();
 }
 agregarFamilia(){
   // console.log(this.formFamilia);
   this.presentLoading("Agregando familia...");
   let suscripcionAddF=this.firestoreHProvider.verificarExistenciaFamilia(this.formFamilia.value).subscribe(familias=>{
        if(familias.length==0){
            this.firestoreHProvider.agregarFamilia(this.formFamilia.value).then((docRef)=>{
              this.firestoreHProvider.actualizarFid(docRef).then(()=>{
                this.formFamilia.controls['apellido'].setValue("");
                this.formFamilia.controls['domicilio'].setValue("");
                this.formFamilia.controls['telefono'].setValue("");
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
 actualizarFamilia(){
   // console.log(this.formFamilia);
   this.presentLoading(`Actualizando datos de la familia ${this.formFamilia.value.apellido}...`);
   this.firestoreHProvider.actualizarfamilia(this.formFamilia.value)
                          .then(()=>{
                            this.cambioF=false;
                            this.loader.dismiss();
                            this.presentToast(`Se actualizaron los datos de la familia ${this.formFamilia.value.apellido} de manera correcta`);
                          })
                          .catch((error)=>{
                            this.loader.dismiss();
                            this.presentToast("Ha ocurrido un error: "+error);
                          });
 }
 cargarFam(fam:Familia){
   this.formFamilia.patchValue(fam);
   this.content.scrollToTop();
   this.operacion="update";
 }
 confirmarEliminar(familia:Familia){
  let confirm = this.alertCtrl.create({
    title: '¿Eliminar familia?',
    message: `¿Esta seguro de que desea eliminar a la familia ${familia.apellido}?`,
    buttons: [
      {
        text: 'NO'
      },
      {
        text: 'Si',
        handler: () => {
          this.presentLoading("Eliminando familia...");
          let susc=this.firestoreHProvider.obtenerHermanosFamilia(familia.fid).subscribe(hermanos=>{
              this.eliminarIntegrantesFamilia(hermanos,familia);
              susc.unsubscribe();
          });
        }
      }
    ]
  });
  confirm.present();
}
async eliminarIntegrantesFamilia(hermanos:Hermano[],familia:Familia){
  this.loader.dismiss();
  this.presentLoading("Eliminando integrantes...");
  try{
    for (let hermano of hermanos){
      await this.firestoreHProvider.eliminarHermano(hermano);
    }
    this.eliminarFamilia(familia);
  }
  catch(err){
    this.loader.dismiss();
    this.presentToast("Ha ocurrido un error al eliminar los integrantes: "+err);
  }
}
async eliminarFamilia(familia:Familia){
  try{
    await this.firestoreHProvider.eliminarFamilia(familia);
    this.loader.dismiss();
    this.presentToast("Se ha eliminado la familia de manera correcta");
  }
  catch(err){
    this.loader.dismiss();
    this.presentToast("Ha ocurrido un error al eliminar la familia: "+err);
  }
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
