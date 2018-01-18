import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirestoreSemanasProvider } from '../../../providers/firestore-semanas/firestore-semanas';
import { FirestoreTemasProvider } from '../../../providers/firestore-temas/firestore-temas';
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
  asignaciones:Asignacion[];
  private semana:Semana;
  obtenido:boolean=false;
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private firestoreSProvider:FirestoreSemanasProvider,
              private firestoreTProvider:FirestoreTemasProvider) {
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
                    this.asignaciones=asignaciones;
                    console.log(asignaciones);
                  });
                });
  }
  pageEditAsignacion(asignacion:Asignacion) {
      this.navCtrl.push(AsignacionPage,{
        'asignacion':asignacion
      });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SemanaPage');
  // }

}
