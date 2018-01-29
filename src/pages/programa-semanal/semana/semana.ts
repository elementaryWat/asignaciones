import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { FirestoreSemanasProvider } from '../../../providers/firestore-semanas/firestore-semanas';
import { FirestoreTemasProvider } from '../../../providers/firestore-temas/firestore-temas';
import { FirestoreHermanosProvider } from '../../../providers/firestore-hermanos/firestore-hermanos';
import {Semana} from '../../../app/interfaces/semana.interface';
import {Asignacion} from '../../../app/interfaces/asignacion.interface';
import {AsignacionPage} from '../asignacion/asignacion';

/**
 * Generated class for the SemanaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-semana',
  templateUrl: 'semana.html',
})
export class SemanaPage {
  private semanaId:string;
  temas:Map<string,string>;
  asignaciones:Asignacion[]=[];
  familias:Map<string,string>;
  hermanos:Map<string,string>;
  private semana:Semana;
  loader:Loading;
  loading:boolean=true;
  obtenido:boolean=false;
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl:LoadingController,
              private firestoreSProvider:FirestoreSemanasProvider,
              private firestoreHProvider:FirestoreHermanosProvider,
              private firestoreTProvider:FirestoreTemasProvider) {
                this.presentLoading("Cargando asignaciones de la semana...");
                this.familias=new Map();
                this.hermanos=new Map();
                this.firestoreHProvider.lfamilias.subscribe(familias=>{
                  for (let familia of familias){
                    this.familias[familia.fid]=familia.apellido;
                  }
                  this.firestoreHProvider.hermanos.subscribe(hermanos=>{
                    for (let hermano of hermanos){
                      this.hermanos[hermano.hid]=`${hermano.nombre} ${this.familias[hermano.familia]}`;
                    }
                  });
                });

                this.semanaId=navParams.get('semana');
                this.temas=new Map();
                firestoreSProvider.obtenerSemana(this.semanaId).subscribe(semanas=>{
                  this.semana=semanas[0];
                  this.obtenido=true;
                });
                firestoreTProvider.obtenerTemas().subscribe(temas=>{
                  for (let tema of temas){
                    this.temas[tema.tid]=tema.nombre;
                  }
                  firestoreTProvider.obtenerAsignacionesSemana(this.semanaId).subscribe(asignaciones=>{
                    if (this.loading){
                      this.loader.dismiss();
                      this.loading=false;
                    }
                    this.asignaciones=asignaciones;
                    // console.log(asignaciones);
                  });
                });
  }
  pageEditAsignacion(asignacion:Asignacion) {
      this.navCtrl.push(AsignacionPage,{
        'operacion':'update',
        'asignacion':asignacion
      });
  }
  presentLoading(mensaje:string) {
    this.loader = this.loadingCtrl.create({
      content: mensaje
    });
    this.loader.present();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SemanaPage');
  // }

}
