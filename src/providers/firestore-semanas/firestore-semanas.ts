import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Semana} from '../../app/interfaces/semana.interface';
import {AuthProvider} from '../auth/auth';
import * as moment from 'moment';
import 'moment/locale/es';

/*
  Generated class for the FirestoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreSemanasProvider {
  semanas:BehaviorSubject<any>;
  fechaI:any;
  constructor(private firestoredb:AngularFirestore,
              private authProvider:AuthProvider) {
    //console.log('Hello FirestoreProvider Provider');
    this.semanas=new BehaviorSubject([]);
    this.fechaI=moment().day(1).format("YYYY-MM-DD");
    this.obtenerSemanas().subscribe(semanas=>{
      this.semanas.next(semanas);
    });
  }
  obtenerSemanas():Observable<any>{
    return this.firestoredb.collection('semanas', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                            .where('desde','>=',this.fechaI)
                                                            .orderBy('desde'))
                            .valueChanges();
  }
  obtenerSemana(sid:string):Observable<any>{
    return this.firestoredb.collection('semanas', ref => ref.where('sid','==',sid))
                            .valueChanges();
  }
  obtenerUltimaSemana(primerLunes:string):Observable<any>{
    return this.firestoredb.collection('semanas', ref =>
                                                  ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                     .where('desde','>=',primerLunes)
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
