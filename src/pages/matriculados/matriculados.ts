import { Component } from '@angular/core';
import { IonicPage,
         ModalController,
         NavController,
         LoadingController,
         Loading,
         AlertController,
         ToastController,
         Toast,} from 'ionic-angular';
import {NuevaFamiliaPage} from './nueva-familia/nueva-familia';
import {NuevoHermanoPage} from './nuevo-hermano/nuevo-hermano';
import {FamiliaConHermano} from '../../app/interfaces/familiaConHermano.interface';
import {FirestoreHermanosProvider} from '../../providers/firestore-hermanos/firestore-hermanos';
import {Subscription} from 'rxjs/Subscription';
import {Hermano} from '../../app/interfaces/hermano.interface';
/**
 * Generated class for the MatriculadosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-matriculados',
  templateUrl: 'matriculados.html',
})
export class MatriculadosPage {
  familias:FamiliaConHermano[]=[];
  famMap:Map<string,number>;
  suscripcionFam:Subscription;
  toast:Toast;
  loader:Loading;
  loading:boolean=true;
  constructor(private modalCtrl:ModalController,
              private navCtrl: NavController,
              private firestoreHProvider:FirestoreHermanosProvider,
              private loadingCtrl:LoadingController,
              private toastCtrl:ToastController,
              private alertCtrl:AlertController) {
      this.presentLoading("Cargando hermanos..");
      this.firestoreHProvider.obtenerHermanosPorFamilia();
      this.firestoreHProvider.hermanosPorFamilia.subscribe(familias=>{
        if (this.loading){
          this.loader.dismiss();
          this.loading=false;
        }
        this.familias=familias;
      });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad MatriculadosPage');
  // }
  pageEditHermano(hermano:Hermano) {
      this.navCtrl.push(NuevoHermanoPage,{
        'operacion':'update',
        'hermano':hermano
      });
  }
  presentModalHermano() {
      let modal = this.modalCtrl.create(NuevoHermanoPage,{
        'operacion':'create'
      });
      modal.present();
  }
  presentLoading(mensaje:string) {
    this.loader = this.loadingCtrl.create({
      content: mensaje
    });
    this.loader.present();
  }
  irAFamilias(fechaDesde:string, fechaHasta:string){
    this.navCtrl.push(NuevaFamiliaPage);
  }
  confirmarEliminar(hermano:Hermano){
   let confirm = this.alertCtrl.create({
     title: '¿Eliminar hermano?',
     message: `¿Esta seguro de que desea eliminar a ${hermano.nombre}?`,
     buttons: [
       {
         text: 'NO'
       },
       {
         text: 'Si',
         handler: () => {
          this.eliminarHermano(hermano);
         }
       }
     ]
   });
   confirm.present();
 }
eliminarHermano(hermano:Hermano){
     this.presentLoading(`Eliminando a  ${hermano.nombre}...`);
     this.firestoreHProvider.eliminarHermano(hermano).then(()=>{
                              this.firestoreHProvider.verificarMiembrosFamilia(hermano.familia).subscribe(hermanos=>{
                                if(hermanos.length==0){
                                  this.firestoreHProvider.esFamiliaSinIntegrantes(hermano.familia).then(()=>{
                                    this.loader.dismiss();
                                    this.presentToast(`Se ha eliminado a ${hermano.nombre} de manera correcta`);
                                  })
                                  .catch(error=>{
                                    this.loader.dismiss();
                                    this.presentToast("Ha ocurrido un error: "+error);
                                  })
                                }else{
                                  this.loader.dismiss();
                                  this.presentToast(`Se ha eliminado a ${hermano.nombre} de manera correcta`);
                                }
                              })
                            })
                            .catch(error=>{
                              this.loader.dismiss();
                              this.presentToast("Ha ocurrido un error: "+error);
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
  ionViewWillUnload(){
    console.log("UnsuscribeFam");
    this.suscripcionFam.unsubscribe();
  }
}
