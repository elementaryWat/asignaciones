import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Usuario} from '../../app/clases/User.class';
import {Credencial} from '../../app/interfaces/credencial.interface';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  currentUser:Usuario;
  estadoLogged:BehaviorSubject<any>;
  constructor(private firestoredb:AngularFirestore) {
    // console.log('Hello AuthProvider Provider');
    this.estadoLogged=new BehaviorSubject(false);
  }
  public login(credenciales:Credencial):Observable<any> {
    const userColection = this.firestoredb.collection<Usuario>('usuarios');
    return this.firestoredb.collection('usuarios', ref => ref.where('email','==',credenciales.email)
                                                             .where('contraseña','==',credenciales.password))
                            .valueChanges();
  }

}
