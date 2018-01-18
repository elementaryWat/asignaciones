import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  asignacion:Asignacion;
  matriculados:Hermano[]=[];
  publicadores:Hermano[]=[];
  precursores:Hermano[]=[];
  siervosM:Hermano[]=[];
  ancianos:Hermano[]=[];
  obtenido:boolean=false;
  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private authProvider:AuthProvider,
              private firestoreTProvider:FirestoreTemasProvider,
              private firestoreHProvider:FirestoreHermanosProvider) {
        this.asignacion=navParams.get("asignacion");
        this.authProvider.obtenerDetallesCong().subscribe(congs=>{
          this.congregacion=congs[0];
        });
        this.crearForm();
        this.firestoreTProvider.obtenerTema(this.asignacion.tema).subscribe(temas=>{
          this.tema=temas[0];
          this.obtenido=true;
          this.asignacion.duracion=this.tema.duracion;
          this.formAsignacion.patchValue(this.asignacion);
          if (this.tema.siervosNombrados){
            if (!this.tema.ancianos){
              this.firestoreHProvider.obtenerHermanosSiervos().subscribe(hermanosS=>{
                this.siervosM=hermanosS;
              });
            }
            this.firestoreHProvider.obtenerHermanosAncianos().subscribe(hermanosS=>{
              this.ancianos=hermanosS;
            });
          }else{
            this.firestoreHProvider.obtenerHermanosMatriculados().subscribe(hermanosS=>{
              this.matriculados=hermanosS;
            });
            this.firestoreHProvider.obtenerHermanosPublicadores().subscribe(hermanosS=>{
              this.publicadores=hermanosS;
            });
            this.firestoreHProvider.obtenerHermanosPrecursores().subscribe(hermanosS=>{
              this.precursores=hermanosS;
            });
          }
        });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad AsignacionPage');
  // }
  crearForm(){
    this.formAsignacion=new FormGroup({
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
    // this.valorI=this.formAsignacion.value;
    // this.formAsignacion.valueChanges.subscribe(()=>{
    //   this.cambioF=JSON.stringify(this.formAsignacion.value)!=JSON.stringify(this.valorI);
    // });
    // this.formAsignacion.controls['genero'].valueChanges.subscribe(value=>{
    //   if(value=='femenino'){
    //     this.formAsignacion.controls['siervoMinisterial'].setValue(false);
    //     this.formAsignacion.controls['anciano'].setValue(false);
    //   }
    // });
  }
  agregarAsignacion(){

  }

}
