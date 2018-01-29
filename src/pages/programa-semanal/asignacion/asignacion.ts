import { Component } from '@angular/core';
import { IonicPage,
          NavController,
          NavParams,
          LoadingController,
          Loading,
          ToastController,
          Toast} from 'ionic-angular';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {FirestoreHermanosProvider} from '../../../providers/firestore-hermanos/firestore-hermanos';
import {FirestoreTemasProvider} from '../../../providers/firestore-temas/firestore-temas';
import {AuthProvider} from '../../../providers/auth/auth';
import {Hermano} from '../../../app/interfaces/hermano.interface';
import {Tema} from '../../../app/interfaces/tema.interface';
import {Congregacion} from '../../../app/interfaces/congregacion.interface';
import {Asignacion} from '../../../app/interfaces/asignacion.interface';
import {LECCIONES} from '../../../app/consts/lecciones.const';
import {SALAS} from '../../../app/consts/salas.const';

/**
 * Generated class for the AsignacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-asignacion',
  templateUrl: 'asignacion.html',
})
export class AsignacionPage {
  formAsignacion:FormGroup;
  valorI:string;
  tema:Tema;
  congregacion:Congregacion;
  cantSalas:number;
  lecciones=LECCIONES;
  salas=SALAS;
  salascong=[];
  asignacion:Asignacion;
  familias:Map<string,string>;
  matriculados:Hermano[]=[];
  publicadores:Hermano[]=[];
  precursores:Hermano[]=[];
  siervosM:Hermano[]=[];
  ancianos:Hermano[]=[];
  obtenido:boolean=false;
  congOb:boolean=false;
  operacion:string;
  loader:Loading;
  toast:Toast;
  cambioF:boolean=false;
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private authProvider:AuthProvider,
              private toastCtrl:ToastController,
              private loadingCtrl:LoadingController,
              private firestoreTProvider:FirestoreTemasProvider,
              private firestoreHProvider:FirestoreHermanosProvider) {

        this.operacion=navParams.get("operacion");
        this.asignacion=navParams.get("asignacion");
        this.familias=new Map();
        this.firestoreHProvider.lfamilias.subscribe(familias=>{
          for (let familia of familias){
            this.familias[familia.fid]=familia.apellido;
          }
        });
        this.authProvider.obtenerDetallesCong().subscribe(congs=>{
          this.congregacion=congs[0];
          this.salascong=[];
          for (let num=0; num<this.congregacion.salas;num++){
            this.salascong.push(this.salas[num]);
          }
          this.congOb=true;
        });
        this.crearForm();
        this.firestoreTProvider.obtenerTema(this.asignacion.tema).subscribe(temas=>{
          this.tema=temas[0];
          this.obtenido=true;
          this.asignacion.duracion=this.tema.duracion;
          this.formAsignacion.patchValue(this.asignacion);
          if (this.tema.siervosNombrados){
            if (!this.tema.ancianos){
              this.firestoreHProvider.siervosM.subscribe(hermanosS=>{
                this.siervosM=hermanosS;
              });
            }
            this.firestoreHProvider.ancianos.subscribe(hermanosS=>{
              this.ancianos=hermanosS;
            });
          }else{
            this.firestoreHProvider.matriculados.subscribe(hermanosS=>{
              this.matriculados=[];
              if (this.tema.soloMan){
                for (let hermano of hermanosS){
                  if (hermano.genero=='masculino'){
                    this.matriculados.push(hermano);
                  }
                }
              }else{
                this.matriculados=hermanosS;
              }
            });
            this.firestoreHProvider.publicadores.subscribe(hermanosS=>{
              this.publicadores=[];
              if (this.tema.soloMan){
                for (let hermano of hermanosS){
                  if (hermano.genero=='masculino'){
                    this.publicadores.push(hermano);
                  }
                }
              }else{
                this.publicadores=hermanosS;
              }
            });
            this.firestoreHProvider.precursores.subscribe(hermanosS=>{
              this.precursores=[];
              if (this.tema.soloMan){
                for (let hermano of hermanosS){
                  if (hermano.genero=='masculino'){
                    this.precursores.push(hermano);
                  }
                }
              }else{
                this.precursores=hermanosS;
              }
            });
          }
        });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad AsignacionPage');
  // }
  crearForm(){
    this.formAsignacion=new FormGroup({
      'aid':new FormControl('',Validators.required),
      'asignado':new FormControl('',Validators.required),
      'semana':new FormControl(''),
      'tema':new FormControl(''),
      'podraCumplir':new FormControl(''),
      'ayudante':new FormControl(''),
      'duracion':new FormControl(''),
      'titulo':new FormControl(''),
      'leccion':new FormControl(''),
      'observaciones':new FormControl(''),
      'sala':new FormControl(''),
    });
    this.valorI=this.formAsignacion.value;
    this.formAsignacion.valueChanges.subscribe(()=>{
      this.cambioF=JSON.stringify(this.formAsignacion.value)!=JSON.stringify(this.valorI);
    });
    // this.formAsignacion.controls['genero'].valueChanges.subscribe(value=>{
    //   if(value=='femenino'){
    //     this.formAsignacion.controls['siervoMinisterial'].setValue(false);
    //     this.formAsignacion.controls['anciano'].setValue(false);
    //   }
    // });
  }
  actualizarAsignacion(){
    this.presentLoading("Actualizando asignacion...");
    this.firestoreTProvider.actualizarAsignacion(this.formAsignacion.value).then(()=>{
                              this.valorI=this.formAsignacion.value;
                              this.cambioF=false;
                              this.loader.dismiss();
                              this.presentToast("Se actualizó la asignacion de manera exitosa");
                            }).catch((error)=>{
                              this.loader.dismiss();
                              this.presentToast("Ha ocurrido un error al actualizar: "+error);
                            });
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
