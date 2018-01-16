import { Component } from '@angular/core';
import { IonicPage,
        NavController,
        LoadingController,
        Loading} from 'ionic-angular';
import {Tema} from '../../../app/interfaces/tema.interface';
import {FirestoreTemasProvider} from '../../../providers/firestore-temas/firestore-temas';
import {TemaPage} from '../tema/tema';
/**
 * Generated class for the AsignacionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-temas',
  templateUrl: 'temas.html',
})
export class TemasPage {
  temas:Tema[];
  loading:boolean=true;
  loader:Loading;
  constructor(public navCtrl: NavController,
              private firestoreTProvider:FirestoreTemasProvider,
              private loadingCtrl:LoadingController) {
    this.presentLoading("Cargando temas...");
    this.firestoreTProvider.obtenerTemas().subscribe(temas=>{
      this.temas=temas;
      if (this.loading){
        this.loader.dismiss();
        this.loading=false;
      }
    });
  }
  irANuevoTema(){
    this.navCtrl.push(TemaPage,{
      'operacion':'create'
    });
  }
  cargarTema(tema:Tema){
    this.navCtrl.push(TemaPage,{
      'operacion':'update',
      'tema':tema
    });
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad Asignaciones Page');
  // }
  presentLoading(mensaje:string) {
    this.loader = this.loadingCtrl.create({
      content: mensaje
    });
    this.loader.present();
  }
}
