import { Component } from '@angular/core';
import { IonicPage,
          NavController,
          NavParams,
          LoadingController,
          Loading,
          ToastController,
          Toast,
          AlertController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NuevaSemanaPage } from './nueva-semana/nueva-semana';
import { FirestoreSemanasProvider } from '../../providers/firestore-semanas/firestore-semanas';
import { FirestoreTemasProvider } from '../../providers/firestore-temas/firestore-temas';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import * as moment from 'moment';
import 'moment/locale/es';
import {Semana} from '../../app/interfaces/semana.interface';
import {Asignacion} from '../../app/interfaces/asignacion.interface';
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
  toast:Toast;
  loading:boolean=true;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl:ModalController,
              private loadingCtrl:LoadingController,
              private toastCtrl:ToastController,
              private alertCtrl:AlertController,
              private firestoreService: FirestoreSemanasProvider,
              private firestoreTProvider: FirestoreTemasProvider) {
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
  irASemana(sid:string){
      this.navCtrl.push(SemanaPage,{
        'semana':sid
      });
  }
  presentLoading(mensaje:string) {
    this.loader = this.loadingCtrl.create({
      content: mensaje
    });
    this.loader.present();
  }
  confirmarEliminar(semana:Semana){
   let confirm = this.alertCtrl.create({
     title: '¿Eliminar semana?',
     message: `¿Esta seguro de que desea eliminar semana del ${moment(semana.desde).format("DD/MM/YYYY")} al ${moment(semana.hasta).format("DD/MM/YYYY")}?`,
     buttons: [
       {
         text: 'NO'
       },
       {
         text: 'Si',
         handler: () => {
          this.firestoreTProvider.obtenerAsignacionesSemana(semana.sid).subscribe(asignaciones=>{

          })
          this.eliminarSemana(semana);
         }
       }
     ]
   });
   confirm.present();
 }
 async eliminarAsignacionesSemana(asignaciones:Asignacion[],semana:Semana){
   this.presentLoading("Eliminando asignaciones de la semana...");
   try{
     for (let asignacion of asignaciones){
       await this.firestoreTProvider.eliminarAsignacion(asignacion);
     }
     this.loader.dismiss();
     this.eliminarSemana(semana);
   }
   catch(err){
     this.loader.dismiss();
     this.presentToast("Ha ocurrido un error al eliminar las asignaciones de la semana: "+err);
   }
 }
 async eliminarSemana(semana:Semana){
   this.presentLoading("Eliminando semana...");
   try{
     await this.firestoreService.eliminarSemana(semana);
     this.loader.dismiss();
     this.presentToast("Se ha eliminado la semana de manera correcta");
   }
   catch(err){
     this.loader.dismiss();
     this.presentToast("Ha ocurrido un error al eliminar la semana: "+err);
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
  ionViewDidLeave(){
    if (this.toast){
      this.toast.dismiss();
    }
  }
}
