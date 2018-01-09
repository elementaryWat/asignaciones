import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  private fechaDesde:string;
  private fechaHasta:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
                this.fechaDesde=navParams.get('fechaDesde');
                this.fechaHasta=navParams.get('fechaHasta');
                console.log('Desde '+this.fechaDesde+' hasta '+this.fechaHasta);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SemanaPage');
  }

}
