import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';

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
  obtenerSemanas(){
    return this.firestoredb.collection('semanas', ref => ref.orderBy('desde')).valueChanges();
  }
  obtenerUltimaSemana(primerLunes:string){
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
  existeSemana(fecha:string):Subscription{
    return this.firestoredb.collection("semanas",ref=>
                                                      ref.where('desde','==',fecha))
                                      .valueChanges()
                                      .subscribe(data=>
                                                {
                                                  return data.length;
                                                });
  }

}
