import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {AuthProvider} from '../auth/auth';
import {Familia} from '../../app/interfaces/familia.interface';
import {Hermano} from '../../app/interfaces/hermano.interface';
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
  dbT:firebase.firestore.Firestore;
  familias:FamiliaConHermano[]=[];
  hermanosPorFamilia:Subject<FamiliaConHermano[]>;
  famMap:Map<string,number>;
  suscripcionFam:Subscription;
  suscripcionesFam:Subscription[]=[];
  constructor(private firestoredb:AngularFirestore,
              private authProvider:AuthProvider) {
      //Referencia de firestore a usar para transacciones
      this.dbT = firebase.firestore();
  }
  obtenerFamilias(){
    return this.firestoredb.collection<Familia>('familias', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                            .orderBy('apellido'))
                            .valueChanges();
  }
  obtenerFamiliasConIntegrantes(){
    return this.firestoredb.collection<Familia>('familias', ref => ref.where('tieneintegrantes','==',true)
                                                                      .where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                                      .orderBy('apellido'))
                            .valueChanges();
  }
  obtenerHermanosFamilia(fid:string){
    return this.firestoredb.collection<Hermano>('hermanos', ref => ref.where('familia','==',fid))
                           .valueChanges();
  }
  obtenerHermanosPorFamilia(){
    this.famMap=new Map();
    this.hermanosPorFamilia=new Subject();
    this.suscripcionFam=this.obtenerFamiliasConIntegrantes().subscribe(familys=>{
      this.familias=[];
      this.famMap.clear();
      if (this.suscripcionesFam.length>0){
        for (let suscripcion of this.suscripcionesFam){
          suscripcion.unsubscribe();
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
