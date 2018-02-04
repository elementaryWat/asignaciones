import { NgModule, ErrorHandler } from '@angular/core';
import { Network } from '@ionic-native/network';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

//Pages
import {LoginPage} from '../pages/login/login';
import {UsuarioPage} from '../pages/usuario/usuario';
import { ProgramaSemanalPage } from '../pages/programa-semanal/programa-semanal';
  import { TemaPage } from '../pages/programa-semanal/tema/tema';
  import { TemasPage } from '../pages/programa-semanal/temas/temas';
  import { NuevaSemanaPage } from '../pages/programa-semanal/nueva-semana/nueva-semana';
  import {SemanaPage} from '../pages/programa-semanal/semana/semana';
  import {AsignacionPage} from '../pages/programa-semanal/asignacion/asignacion';
import { MisAsignacionesPage } from '../pages/mis-asignaciones/mis-asignaciones';
import { MatriculadosPage } from '../pages/matriculados/matriculados';
  import {FamiliaPage} from '../pages/matriculados/familia/familia';
  import {HermanoPage} from '../pages/matriculados/hermano/hermano';

import { TabsPage } from '../pages/tabs/tabs';

//Firestore
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

//Pipes
import {FechaPipe} from '../pipes/fecha/fecha';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirestoreSemanasProvider } from '../providers/firestore-semanas/firestore-semanas';
import { FirestoreHermanosProvider } from '../providers/firestore-hermanos/firestore-hermanos';
import { AuthProvider } from '../providers/auth/auth';
import { FirestoreTemasProvider } from '../providers/firestore-temas/firestore-temas';

const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCSSk4g1RoBaKoZh0Sl15kJ9dtMMnN-8CE",
    authDomain: "programareuniones-96142.firebaseapp.com",
    databaseURL: "https://programareuniones-96142.firebaseio.com",
    projectId: "programareuniones-96142",
    storageBucket: "programareuniones-96142.appspot.com",
    messagingSenderId: "168788241633"
  }
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    UsuarioPage,
    ProgramaSemanalPage,
      TemaPage,
      TemasPage,
      NuevaSemanaPage,
      SemanaPage,
      AsignacionPage,
    MisAsignacionesPage,
    MatriculadosPage,
      FamiliaPage,
      HermanoPage,
    TabsPage,
    FechaPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
     backButtonText: '',
     modalEnter: 'modal-slide-in',
     modalLeave: 'modal-slide-out',
     tabsPlacement: 'bottom',
     pageTransition: 'ios-transition'
   }
 ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    UsuarioPage,
    ProgramaSemanalPage,
      TemaPage,
      TemasPage,
      NuevaSemanaPage,
      SemanaPage,
      AsignacionPage,
    MisAsignacionesPage,
    MatriculadosPage,
      FamiliaPage,
      HermanoPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirestoreSemanasProvider,
    FirestoreHermanosProvider,
    AuthProvider,
    Network,
    FirestoreTemasProvider
  ]
})
export class AppModule {}
