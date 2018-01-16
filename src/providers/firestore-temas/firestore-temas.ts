import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {Tema} from '../../app/interfaces/tema.interface';

/*
  Generated class for the TemasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreTemasProvider {

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
  eliminarTema(tema:Tema):Promise<any>{
    return this.firestoredb.collection<Tema>('temas').doc(tema.tid).delete();
  }
}
