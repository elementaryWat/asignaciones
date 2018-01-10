import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the FirestoreHermanosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreHermanosProvider {

  constructor(private firestoredb:AngularFirestore) {

  }

}
