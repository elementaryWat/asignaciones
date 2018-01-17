import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {Tema} from '../../app/interfaces/tema.interface';
import {Reunion} from '../../app/interfaces/reunion.interface';
import {ReunionConTemas} from '../../app/interfaces/reunionConTemas.interface';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
/*
  Generated class for the TemasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreTemasProvider {
  reuMap:Map<string,number>;
  temasPorReu:Subject<any>;
  suscripcionReu:Subscription;
  suscripcionesTemas:Subscription[]=[];
  reuniones:ReunionConTemas[]=[];
  constructor(private firestoredb:AngularFirestore) {

  }
  agregarTema(tema:Tema):Promise<any>{
    return this.firestoredb.collection<Tema>('temas').add(tema);
  }
  actualizarTid(docRef:any){
    return this.firestoredb.collection<Tema>('temas').doc(docRef.id).update({tid:docRef.id});
  }
  actualizarTema(tema:Tema):Promise<any>{
    return this.firestoredb.collection<Tema>('temas').doc(tema.tid).update(tema);
  }
  obtenerTemas(){
    return this.firestoredb.collection<Tema>('temas', ref=> ref.orderBy('nombre'))
                           .valueChanges();
  }
  obtenerTemasReunion(reunion:string){
    return this.firestoredb.collection<Tema>('temas', ref=> ref.where('reunion','==',reunion)
                                                               .orderBy('nombre'))
                           .valueChanges();
  }
  obtenerReuniones(){
    return this.firestoredb.collection<Reunion>('reuniones', ref=> ref.orderBy('nombre'))
                           .valueChanges();
  }
  obtenerTemasPorReunion(){
    this.reuMap=new Map();
    this.temasPorReu=new Subject();
    this.suscripcionReu=this.obtenerReuniones().subscribe(reuss=>{
      this.reuniones=[];
      this.reuMap.clear();
      if (this.suscripcionesTemas.length>0){
        for (let idx in this.suscripcionesTemas){
          this.suscripcionesTemas[idx].unsubscribe();
        }
        this.suscripcionesTemas=[];
      }
        for(let reu of reuss){
            // console.log(`Se suscribe la familia ${familia.apellido}`);
            let susc=this.obtenerTemasReunion(reu.value).subscribe(temas=>{
            // console.log(`Se obtiene la familia ${familia.apellido}`);
            let posR=this.reuMap.get(reu.value);
            if(posR!=undefined){
              this.reuniones[posR].temas=temas;
            }else{
              let lengthA=this.reuniones.push({nombre:reu.nombre,temas:temas});
              this.reuMap.set(reu.value,lengthA-1);
              //console.log(this.famMap.get(familia.fid));
            }
            this.temasPorReu.next(this.reuniones);
          });
          this.suscripcionesTemas.push(susc);
        }
    });
  }
  eliminarTema(tema:Tema):Promise<any>{
    return this.firestoredb.collection<Tema>('temas').doc(tema.tid).delete();
  }
}
