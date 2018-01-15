import { NgModule, ErrorHandler } from '@angular/core';
import { Network } from '@ionic-native/network';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

//Pages
import {LoginPage} from '../pages/login/login';
import { ProgramaSemanalPage } from '../pages/programa-semanal/programa-semanal';
  import { TemasPage } from '../pages/programa-semanal/temas/temas';
  import { NuevaSemanaPage } from '../pages/programa-semanal/nueva-semana/nueva-semana';
  import {SemanaPage} from '../pages/programa-semanal/semana/semana';
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
import { FirestoreProvider } from '../providers/firestore/firestore';
import { FirestoreHermanosProvider } from '../providers/firestore-hermanos/firestore-hermanos';
import { AuthProvider } from '../providers/auth/auth';

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
    ProgramaSemanalPage,
      TemasPage,
      NuevaSemanaPage,
      SemanaPage,
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
    ProgramaSemanalPage,
      TemasPage,
      NuevaSemanaPage,
      SemanaPage,
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
    FirestoreProvider,
    FirestoreHermanosProvider,
    AuthProvider,
    Network
  ]
})
export class AppModule {}
