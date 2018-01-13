import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
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
  suscHermanos:Subscription;
  constructor(private modalCtrl:ModalController,
              private navCtrl: NavController,
              private firestoreHProvider:FirestoreHermanosProvider) {
      this.famMap=new Map();
      this.suscripcionFam=this.firestoreHProvider.obtenerFamiliasConIntegrantes().subscribe(familys=>{
        this.familias=[];
        this.famMap.clear();
          for(let familia of familys){
              this.firestoreHProvider.obtenerHermanosFamilia(familia.fid).subscribe(integrantes=>{
              let posF=this.famMap.get(familia.fid);
              if(posF!=undefined){
                this.familias[posF].integrantes=integrantes;
              }else{
                let lengthA=this.familias.push({apellido:familia.apellido,integrantes:integrantes});
                this.famMap.set(familia.fid,lengthA-1);
                //console.log(this.famMap.get(familia.fid));
              }
            });
          }
      });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad MatriculadosPage');
  // }
  presentModalHermano() {
      let modal = this.modalCtrl.create(NuevoHermanoPage);
      modal.present();
  }
  irAFamilias(fechaDesde:string, fechaHasta:string){
    this.navCtrl.push(NuevaFamiliaPage);
  }
  ionViewWillUnload(){
    console.log("UnsuscribeFam");
    this.suscripcionFam.unsubscribe();
    this.suscHermanos.unsubscribe();
  }
}
