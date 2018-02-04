import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {AuthProvider} from '../auth/auth';
import {Familia} from '../../app/interfaces/familia.interface';
import {Hermano} from '../../app/interfaces/hermano.interface';
import {Usuario} from '../../app/clases/User.class';
import {FamiliaConHermano} from '../../app/interfaces/familiaConHermano.interface';

import firebase from 'firebase';
import 'firebase/firestore';
/*
  Generated class for the FirestoreHermanosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreHermanosProvider {
  // hermanosTipo:FamiliaConHermano[]=[];
  dbT:firebase.firestore.Firestore;
  familias:FamiliaConHermano[]=[];
  hermanosPorFamilia:Subject<FamiliaConHermano[]>;
  famMap:Map<string,number>;
  suscripcionFam:Subscription;
  suscripcionesFam:Subscription[]=[];
  usuarios:BehaviorSubject<any>;
  hermanos:BehaviorSubject<any>;
  lfamilias:BehaviorSubject<any>;
  matriculados:BehaviorSubject<any>;
  publicadores:BehaviorSubject<any>;
  precursores:BehaviorSubject<any>;
  ancianos:BehaviorSubject<any>;
  siervosM:BehaviorSubject<any>;
  constructor(private firestoredb:AngularFirestore,
              private authProvider:AuthProvider) {
      //Referencia de firestore a usar para transacciones
      this.dbT = firebase.firestore();
      this.lfamilias=new BehaviorSubject([]);
      this.usuarios=new BehaviorSubject([]);
      this.hermanos=new BehaviorSubject([]);
      this.matriculados=new BehaviorSubject([]);
      this.publicadores=new BehaviorSubject([]);
      this.precursores=new BehaviorSubject([]);
      this.siervosM=new BehaviorSubject([]);
      this.ancianos=new BehaviorSubject([]);
      this.obtenerUsuarios().subscribe(usuarios=>{
                                    this.usuarios.next(usuarios);
                                  });
      this.obtenerFamilias().subscribe(familias=>{
                                    this.lfamilias.next(familias);
                                  });
      this.obtenerHermanos().subscribe(hermanosS=>{
                                    this.hermanos.next(hermanosS);
                                  });
      this.obtenerHermanosMatriculados().subscribe(hermanosS=>{
                                    this.matriculados.next(hermanosS);
                                  });
      this.obtenerHermanosPublicadores().subscribe(hermanosS=>{
                                    this.publicadores.next(hermanosS);
                                  });
      this.obtenerHermanosPrecursores().subscribe(hermanosS=>{
                                    this.precursores.next(hermanosS);
                                  });
      this.obtenerHermanosSiervos().subscribe(hermanosS=>{
                                    this.siervosM.next(hermanosS);
                                  });
      this.obtenerHermanosAncianos().subscribe(hermanosS=>{
                                    this.ancianos.next(hermanosS);
                                  });
  }
  agregarUsuario(usuario:Usuario){
    let nUser = this.dbT.collection("usuarios").doc();
    usuario.uid=nUser.id;
    return nUser.set(usuario);
  }
  actualizarUsuario(usuario:Usuario){
    return this.firestoredb.collection<Usuario>('usuarios').doc(usuario.uid).update(usuario);
  }
  obtenerUsuarios(){
    return this.firestoredb.collection<Usuario>('usuarios', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion))
                           .valueChanges();
  }
  obtenerUsuario(uid:string){
    return this.firestoredb.collection<Usuario>('usuarios', ref => ref.where('uid','==',uid)).valueChanges();
  }
  obtenerHermanos(){
    return this.firestoredb.collection<Hermano>('hermanos', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion))
                           .valueChanges();
  }
  obtenerFamilias(){
    return this.firestoredb.collection<Familia>('familias', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                            .orderBy('apellido'))
                            .valueChanges();
  }
  obtenerFamiliasConIntegrantes(){
    return this.firestoredb.collection<Familia>('familias', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                                      .where('tieneintegrantes','==',true)
                                                                      .where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                                      .orderBy('apellido'))
                            .valueChanges();
  }
  obtenerHermanosMatriculados(){
    return this.firestoredb.collection<Hermano>('hermanos', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                                      .where('publicador','==',false)
                                                                      .orderBy('nombre'))
                           .valueChanges();
  }
  obtenerHermanosPublicadores(){
    return this.firestoredb.collection<Hermano>('hermanos', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                                      .where('publicador','==',true)
                                                                      .where('precursorRegular','==',false)
                                                                      .where('siervoMinisterial','==',false)
                                                                      .where('anciano','==',false)
                                                                      .orderBy('nombre'))
                           .valueChanges();
  }
  obtenerHermanosPrecursores(){
    return this.firestoredb.collection<Hermano>('hermanos', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                                      .where('precursorRegular','==',true)
                                                                      .where('siervoMinisterial','==',false)
                                                                      .where('anciano','==',false)
                                                                      .orderBy('nombre'))
                           .valueChanges();
  }
  obtenerHermanosSiervos(){
    return this.firestoredb.collection<Hermano>('hermanos', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                                      .where('siervoMinisterial','==',true)
                                                                      .orderBy('nombre'))
                           .valueChanges();
  }
  obtenerHermanosAncianos(){
    return this.firestoredb.collection<Hermano>('hermanos', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                                      .where('anciano','==',true)
                                                                      .orderBy('nombre'))
                           .valueChanges();
  }

  obtenerHermanosFamilia(fid:string){
    return this.firestoredb.collection<Hermano>('hermanos', ref => ref.where('familia','==',fid)
                                                                      .orderBy('nombre'))
                           .valueChanges();
  }
  obtenerHermanosPorFamilia(){
    this.famMap=new Map();
    this.hermanosPorFamilia=new Subject();
    this.suscripcionFam=this.obtenerFamiliasConIntegrantes().subscribe(familys=>{
      this.familias=[];
      this.famMap.clear();
      if (familys.length>0){
        if (this.suscripcionesFam.length>0){
          for (let idx in this.suscripcionesFam){
            this.suscripcionesFam[idx].unsubscribe();
          }
          this.suscripcionesFam=[];
        }
          for(let familia of familys){
              // console.log(`Se suscribe la familia ${familia.apellido}`);
              let susc=this.obtenerHermanosFamilia(familia.fid).subscribe(integrantes=>{
              // console.log(`Se obtiene la familia ${familia.apellido}`);
              let posF=this.famMap.get(familia.fid);
              if(posF!=undefined){
                this.familias[posF].integrantes=integrantes;
              }else{
                let lengthA=this.familias.push({apellido:familia.apellido,integrantes:integrantes});
                this.famMap.set(familia.fid,lengthA-1);
                //console.log(this.famMap.get(familia.fid));
              }
              this.hermanosPorFamilia.next(this.familias);
            });
            this.suscripcionesFam.push(susc);
          }
      }else{
        this.hermanosPorFamilia.next([]);
      }
    });
  }
  verificarExistenciaFamilia(familia:Familia){
    return this.firestoredb.collection<Familia>('familias', ref => ref.where('congregacion','==',familia.congregacion)
                                                                      .where('apellido','==',familia.apellido))
                            .valueChanges();
  }
  agregarFamilia(familia:Familia):Promise<any>{
    return this.firestoredb.collection<Familia>('familias').add(familia);
  }
  actualizarfamilia(familia:Familia):Promise<any>{
    return this.firestoredb.collection<Hermano>('familias').doc(familia.fid).update(familia);
  }
  eliminarFamilia(familia:Familia):Promise<any>{
    return this.firestoredb.collection<Familia>('familias').doc(familia.fid).delete();
  }
  actualizarFid(docRef:any){
    return this.firestoredb.collection<Familia>('familias').doc(docRef.id).update({fid:docRef.id});
  }
  verificarExistenciaHermano(hermano:Hermano){
    return this.firestoredb.collection<Hermano>('hermanos', ref => ref.where('familia','==',hermano.familia)
                                                                      .where('nombre','==',hermano.nombre))
                            .valueChanges();
  }
  actualizarHermano(hermano:Hermano):Promise<any>{
    return this.firestoredb.collection<Hermano>('hermanos').doc(hermano.hid).update(hermano);
  }
  agregarHermano(hermano:Hermano):Promise<any>{
    return this.firestoredb.collection<Hermano>('hermanos').add(hermano);
  }
  eliminarHermano(hermano:Hermano):Promise<any>{
    return this.firestoredb.collection<Hermano>('hermanos').doc(hermano.hid).delete();
  }
  verificarMiembrosFamilia(fid:string){
    return this.firestoredb.collection<Hermano>('hermanos' , ref => ref.where('familia','==',fid)).valueChanges();
  }
  esFamiliaSinIntegrantes(fid:string){
    return this.firestoredb.collection<Hermano>('familias').doc(fid).update({tieneintegrantes:false});
  }
  configHermanoyFamilia(hid:string, fid:string){
    //Actualizacion en lotes del atributo id del hermano y tieneintegrantes de familia
    var batch = this.dbT.batch();
    var hermanoRef = this.dbT.collection("hermanos").doc(hid);
    batch.update(hermanoRef, {'hid': hid});

    var familiaRef = this.dbT.collection("familias").doc(fid);
    batch.update(familiaRef, {"tieneintegrantes": true});

    // Commit the batch
    return batch.commit();
  }
}
