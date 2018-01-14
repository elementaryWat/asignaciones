import { Component } from '@angular/core';
import { IonicPage,
         ModalController,
         NavController,
         LoadingController,
         Loading} from 'ionic-angular';
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
  loader:Loading;
  loading:boolean=true;
  constructor(private modalCtrl:ModalController,
              private navCtrl: NavController,
              private firestoreHProvider:FirestoreHermanosProvider,
              private loadingCtrl:LoadingController) {
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
  ionViewWillUnload(){
    console.log("UnsuscribeFam");
    this.suscripcionFam.unsubscribe();
  }
}
