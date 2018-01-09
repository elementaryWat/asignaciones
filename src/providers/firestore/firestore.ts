import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the FirestoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreProvider {
  constructor(private firestoredb:AngularFirestore) {
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
          hasta: hasta
      });
  }
  existeSemana(fecha:string):Observable<any>{
    return this.firestoredb.collection("semanas",ref=>
                                                      ref.where('desde','==',fecha))
                                      .valueChanges();
  }

}
