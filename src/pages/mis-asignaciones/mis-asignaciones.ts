import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import {FirestoreTemasProvider} from '../../providers/firestore-temas/firestore-temas';
import {FirestoreSemanasProvider} from '../../providers/firestore-semanas/firestore-semanas';
import {AuthProvider} from '../../providers/auth/auth';
import {Asignacion} from '../../app/interfaces/asignacion.interface';
import {Tema} from '../../app/interfaces/tema.interface';
import {Semana} from '../../app/interfaces/semana.interface';

/**
 * Generated class for the MisAsignacionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mis-asignaciones',
  templateUrl: 'mis-asignaciones.html',
})
export class MisAsignacionesPage {
  asignaciones:Asignacion[]=[];
  loader:Loading;
  loading:boolean=true;
  //codTema=>nombreTema
  temas:Map<string,string>;
  semanas:Map<string,Semana>;
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private firestoreTProvider:FirestoreTemasProvider,
              private firestoreSProvider:FirestoreSemanasProvider,
              private authProvider:AuthProvider,
              private loadingCtrl:LoadingController
              ) {
        this.presentLoading("Obteniendo mis asignaciones...");
        this.temas=new Map();
        this.semanas=new Map();
        //TODO Obtener asignaciones por semana
        this.firestoreSProvider.semanas.subscribe(semanas=>{
          for (let semana of semanas){
            this.semanas[semana.sid]=semana;
          }
        });
        this.firestoreTProvider.temas.subscribe(temas=>{
          for (let tema of temas){
            this.temas[tema.tid]=tema.nombre;
          }
        });
        this.firestoreTProvider.obtenerAsignacionesHermanoActuales(this.authProvider.currentUser.hid).subscribe(asignaciones=>{
          this.asignaciones=asignaciones;
          if(this.loading){
            this.loader.dismiss();
            this.loading=false;
          }
        });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad MisAsignacionesPage');
  // }
  presentLoading(mensaje:string) {
    this.loader = this.loadingCtrl.create({
      content: mensaje
    });
    this.loader.present();
  }
}
