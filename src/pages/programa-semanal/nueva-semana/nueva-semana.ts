import { Component } from '@angular/core';
import { IonicPage,
          NavController,
          NavParams,
          ViewController,
          ToastController} from 'ionic-angular';
import {FirestoreProvider} from '../../../providers/firestore/firestore';
import * as moment from 'moment';
import 'moment/locale/es';

/**
 * Generated class for the NuevaSemanaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nueva-semana',
  templateUrl: 'nueva-semana.html',
})
export class NuevaSemanaPage {
  myDate:string;
  hastaFecha:string;
  primerLunes:string;
  fechaMaxima:string;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl:ViewController,
              private toastCtrl: ToastController,
              public firestoreService:FirestoreProvider) {
        this.primerLunes=moment().day(1).format("YYYY-MM-DD");
        this.fechaMaxima=moment().day(1).add(8, 'weeks').format("YYYY-MM-DD");
        // console.log(this.primerLunes);
        // console.log(this.fechaMaxima);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NuevaSemanaPage');
    //console.log('Semana'+this.navParams.get('fechaDesde'));
    this.myDate=this.navParams.get('fechaDesde');
    this.hastaFecha=moment(this.myDate).add(6,"days").format("YYYY-MM-DD");
  }
  actualizarFecHasta(){
    this.hastaFecha=moment(this.myDate).add(6,"days").format("YYYY-MM-DD");
  }
  agregarSemana(context:any){
    if(moment(this.myDate).day()==1){
      let suscripcion=this.firestoreService.existeSemana(this.myDate)
                           .subscribe(data=>{
                                      if (data.length==0){
                                        this.firestoreService.agregarSemana(this.myDate, this.hastaFecha)
                                                                            .then(function(docRef) {
                                                                                // console.log("Documento escrito con ID: ", docRef.id);
                                                                                context.presentToast("Se ha agregado la semana de manera exitosa");
                                                                                context.dismiss();

                                                                            })
                                                                            .catch(function(error) {
                                                                                // console.error("Error añadiendo documento: ", error);
                                                                                context.presentToast("Hubo un error");
                                                                          });
                                      }else{
                                        context.presentToast("Ya existe esta semana");
                                      }
                                      //Evita que la semana se agregue sola
                                      suscripcion.unsubscribe();
                           });
    }else{
      this.presentToast("La semana debe empezar un lunes");
    }

  }
  dismiss() {
   this.viewCtrl.dismiss();
 }
 presentToast(mensaje:string) {
  let toast = this.toastCtrl.create({
      message: mensaje,
      position: 'bottom',
      showCloseButton:true,
      closeButtonText:"OK"
    });

    toast.present();
  }
}
