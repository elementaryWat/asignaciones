import { Component } from '@angular/core';
import { IonicPage,
         ModalController,
         NavController,
         LoadingController,
         Loading,
         AlertController,
         ToastController,
         Toast,} from 'ionic-angular';
import {FamiliaPage} from './familia/familia';
import {HermanoPage} from './hermano/hermano';
import {UsuarioPage} from '../usuario/usuario';
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
  usuarios:Map<string,string>;
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
      this.firestoreHProvider.usuarios.subscribe(usuarios=>{
        this.usuarios=new Map();
        for (let usuario of usuarios){
          this.usuarios[usuario.hid]=usuario.uid;
        }
      });
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
      this.navCtrl.push(HermanoPage,{
        'operacion':'update',
        'hermano':hermano
      });
  }
  pageEditUsuario(hermano:Hermano, usuario?:string) {
      if (usuario){
        this.navCtrl.push(UsuarioPage,{
          'operacion':'update',
          'usuario':usuario
        });
      }else{
        this.navCtrl.push(UsuarioPage,{
          'operacion':'create',
          'hermano':hermano
        });
      }
  }
  presentModalHermano() {
      let modal = this.modalCtrl.create(HermanoPage,{
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
    this.navCtrl.push(FamiliaPage);
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
                              let susc=this.firestoreHProvider.verificarMiembrosFamilia(hermano.familia).subscribe(hermanos=>{
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
                                susc.unsubscribe();
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
  // ionViewWillUnload(){
  //   console.log("UnsuscribeFam");
  //   this.suscripcionFam.unsubscribe();
  // }
}
