import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {AuthProvider} from '../auth/auth';
import {Familia} from '../../app/interfaces/familia.interface';
/*
  Generated class for the FirestoreHermanosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreHermanosProvider {

  constructor(private firestoredb:AngularFirestore,
              private authProvider:AuthProvider) {
  }
  obtenerFamilias(){
    return this.firestoredb.collection<Familia>('familias', ref => ref.where('congregacion','==',this.authProvider.currentUser.congregacion)
                                                            .orderBy('apellido'))
                            .valueChanges();
  }
  verificarExistencia(familia:Familia){
    return this.firestoredb.collection<Familia>('familias', ref => ref.where('congregacion','==',familia.congregacion)
                                                               .where('apellido','==',familia.apellido))
                            .valueChanges();
  }
  agregarFamilia(familia:Familia){
    return this.firestoredb.collection<Familia>('familias').add(familia);
  }
}
