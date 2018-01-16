import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Semana} from '../../app/interfaces/semana.interface';
import {AuthProvider} from '../auth/auth';


/*
  Generated class for the FirestoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreSemanasProvider {
  constructor(private firestoredb:AngularFirestore,
              private authProvider:AuthProvider) {
    //console.log('Hello FirestoreProvider Provider');

  }
  obtenerSemanas(fechaInicial):Observable<any>{
    return this.firestoredb.collection('semanas', ref => ref.where('desde','>=',fechaInicial)
                                                            .orderBy('desde'))
                            .valueChanges();
  }
  obtenerUltimaSemana(primerLunes:string):Observable<any>{
    return this.firestoredb.collection('semanas', ref =>
                                                  ref.where('desde','>=',primerLunes)
                                                     .orderBy('desde','desc')
                                                     .limit(1))
                            .valueChanges();
  }
  agregarSemana(desde:string, hasta:string):Promise<any>{
    return this.firestoredb.collection("semanas").add({
          desde: desde,
          hasta: hasta,
          congregacion:this.authProvider.currentUser.congregacion
      });
  }
  actualizarSid(sid:string):Promise<any>{
    return this.firestoredb.collection("semanas").doc(sid).update({sid:sid});
  }
  eliminarSemana(semana:Semana):Promise<any>{
    return this.firestoredb.collection<Semana>("semanas").doc(semana.sid).delete();
  }
  existeSemana(fecha:string):Observable<any>{
    return this.firestoredb.collection("semanas",ref=>ref.where('desde','==',fecha)
                                                         .where('congregacion','==',this.authProvider.currentUser.congregacion))
                                      .valueChanges();
  }

}
