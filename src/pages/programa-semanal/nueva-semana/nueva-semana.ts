import { Component } from '@angular/core';
import { IonicPage,
          NavController,
          NavParams,
          ViewController,
          ToastController,
          Toast,
          LoadingController,
          Loading} from 'ionic-angular';
import {FirestoreTemasProvider} from '../../../providers/firestore-temas/firestore-temas';
import {FirestoreSemanasProvider} from '../../../providers/firestore-semanas/firestore-semanas';
import * as moment from 'moment';
import 'moment/locale/es';
import {reuniones} from '../../../app/consts/reuniones.const';
import {Subscription} from 'rxjs/Subscription';
import {FormGroup, FormControl, Validators,FormArray} from '@angular/forms';

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
  toast:Toast;
  loader:Loading;
  REUNIONES=reuniones;
  suscReun:Subscription[]=[];
  formTemas:FormGroup;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl:ViewController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private firestoreService:FirestoreSemanasProvider,
              private firestoreTProvider:FirestoreTemasProvider) {
        this.primerLunes=moment().day(1).format("YYYY-MM-DD");
        this.fechaMaxima=moment().day(1).add(8, 'weeks').format("YYYY-MM-DD");
        // console.log(this.primerLunes);
        // console.log(this.fechaMaxima);
        this.crearForm();
        this.resetTemas();
        for(let idx in this.REUNIONES){
          this.REUNIONES[idx].susc=this.firestoreTProvider.obtenerTemasReunion(this.REUNIONES[idx].value).subscribe(temas=>{
            this.REUNIONES[idx].temas=temas;
            for (let tema of temas){
              this.formTemas.addControl(tema.tid,new FormControl(tema.default));
              // console.log(tema.nombre);
            }
          })
        }
  }
  resetTemas(){
    for (let idx in this.REUNIONES){
      this.REUNIONES[idx].temas=[];
    }
  }
  crearForm(){
    this.formTemas=new FormGroup({});
    // this.formTema.patchValue(this.tema);
    // let valorI=this.formTema.value;
    // this.formTema.valueChanges.subscribe(()=>{
    //   this.cambioF=JSON.stringify(this.formTema.value)!=JSON.stringify(valorI);
    // });
  }
  agregarAsignaciones(){

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
    this.presentLoading("Agregando semana...");
    if(moment(this.myDate).day()==1){
      let suscripcion=this.firestoreService.existeSemana(this.myDate)
                           .subscribe(data=>{
                                      if (data.length==0){
                                        this.agregandoSemana(context);
                                      }else{
                                        context.presentToast("Ya existe esta semana");
                                        context.loader.dismiss();
                                      }
                                      //Evita que la semana se agregue sola
                                      suscripcion.unsubscribe();
                           });
    }else{
      this.presentToast("La semana debe empezar un lunes");
    }

  }
  async agregandoSemana(context:any)  {
      try {
        let docRef=await this.firestoreService.agregarSemana(this.myDate, this.hastaFecha);
        await this.firestoreService.actualizarSid(docRef.id);
        context.presentToast("Se ha agregado la semana de manera exitosa");
        context.loader.dismiss();
        context.dismiss();
      }
      catch(err) {
        this.loader.dismiss();
        this.presentToast("Ha ocurrido un error al agregar la semana: "+err);
      }
  }
  dismiss() {
   this.viewCtrl.dismiss();
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
  presentLoading(mensaje:string) {
    this.loader = this.loadingCtrl.create({
      content: mensaje
    });
    this.loader.present();
  }
  ionViewDidLeave(){
    if (this.toast){
      this.toast.dismiss();
    }
  }
}
