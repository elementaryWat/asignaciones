import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//Pages
import { ProgramaSemanalPage } from '../pages/programa-semanal/programa-semanal';
  import { NuevaSemanaPage } from '../pages/programa-semanal/nueva-semana/nueva-semana';
  import {SemanaPage} from '../pages/programa-semanal/semana/semana';
import { MisAsignacionesPage } from '../pages/mis-asignaciones/mis-asignaciones';
import { MatriculadosPage } from '../pages/matriculados/matriculados';
  import {NuevaFamiliaPage} from '../pages/matriculados/nueva-familia/nueva-familia';

import { TabsPage } from '../pages/tabs/tabs';

//Firestore
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

//Pipes
import {FechaPipe} from '../pipes/fecha/fecha';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirestoreProvider } from '../providers/firestore/firestore';

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
    ProgramaSemanalPage,
      NuevaSemanaPage,
      SemanaPage,
    MisAsignacionesPage,
    MatriculadosPage,
      NuevaFamiliaPage,
    TabsPage,
    FechaPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
     backButtonText: 'VOLVER',
     modalEnter: 'modal-slide-in',
     modalLeave: 'modal-slide-out',
     tabsPlacement: 'bottom'
   }
 ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProgramaSemanalPage,
      NuevaSemanaPage,
      SemanaPage,
    MisAsignacionesPage,
    MatriculadosPage,
      NuevaFamiliaPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirestoreProvider
  ]
})
export class AppModule {}
