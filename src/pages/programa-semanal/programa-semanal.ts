import { Component } from '@angular/core';
import { IonicPage,
          NavController,
          NavParams,
          LoadingController,
          Loading,
          AlertController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NuevaSemanaPage } from './nueva-semana/nueva-semana';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import * as moment from 'moment';
import 'moment/locale/es';
import {Semana} from '../../app/interfaces/semana.interface';
import {SemanaPage} from './semana/semana';
import {TemasPage} from './temas/temas';
/**
 * Generated class for the ProgramaSemanalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-programa-semanal',
  templateUrl: 'programa-semanal.html',
})
export class ProgramaSemanalPage {
  semanas: Semana[]=[];
  fechaLimInf:string;
  primerLunes:string;
  loader:Loading;
  loading:boolean=true;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl:ModalController,
              private loadingCtrl:LoadingController,
              private alertCtrl:AlertController,
              private firestoreService: FirestoreProvider) {
      this.fechaLimInf=moment().day(1).format("YYYY-MM-DD");
      this.presentLoading("Cargando semanas...");
      firestoreService.obtenerSemanas(this.fechaLimInf).subscribe(semanas=>{
        if (this.loading){
          this.loader.dismiss();
          this.loading=false;
        }
        this.semanas=semanas;
      });
      this.definirFechaInicial();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ProgramaSemanalPage');
  // }
  definirFechaInicial(){
    this.primerLunes=this.fechaLimInf;
    this.firestoreService.obtenerUltimaSemana(this.primerLunes)
                                      .subscribe(data =>{
                                        if (data.length!=0){
                                          let semana:Semana=data[0];
                                          this.primerLunes=moment(semana.desde).add(7,"days").format("YYYY-MM-DD");
                                          //console.log(semana.desde)
                                        }
                                      });
  }
  presentModal() {
      let fechaMaxima=moment().day(1).add(8, 'weeks').format("YYYY-MM-DD");
      let modal = this.modalCtrl.create(NuevaSemanaPage,{fechaDesde:this.primerLunes});
      modal.present();
  }
  irATemas(){
    this.navCtrl.push(TemasPage);
  }
  irASemana(fechaDesde:string, fechaHasta:string){
      this.navCtrl.push(SemanaPage,{
        fechaDesde:fechaDesde,
        fechaHasta:fechaHasta
      });
  }
  presentLoading(mensaje:string) {
    this.loader = this.loadingCtrl.create({
      content: mensaje
    });
    this.loader.present();
  }
  confirmarEliminar(){
   let confirm = this.alertCtrl.create({
     title: '¿Eliminar semana?',
     message: '¿Esta seguro de que desea eliminar esta semana?',
     buttons: [
       {
         text: 'NO'
       },
       {
         text: 'Si',
         handler: () => {
          console.log("Se eliminara");
         }
       }
     ]
   });
   confirm.present();
 }
}
