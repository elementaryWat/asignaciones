import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NuevaSemanaPage } from '../nueva-semana/nueva-semana';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import * as moment from 'moment';
import 'moment/locale/es';
import {Semana} from '../../app/interfaces/semana.interface';
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
  semanas: Observable<any[]>;
  primerLunes:string;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl:ModalController,
              private firestoreService: FirestoreProvider) {
                this.semanas=firestoreService.obtenerSemanas();
                this.definirFechaInicial();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgramaSemanalPage');
  }
  definirFechaInicial(){
    this.primerLunes=moment().day(1).format("YYYY-MM-DD");
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
  }
