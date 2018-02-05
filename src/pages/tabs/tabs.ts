import { Component } from '@angular/core';

import { ProgramaSemanalPage } from '../programa-semanal/programa-semanal';
import { MisAsignacionesPage } from '../mis-asignaciones/mis-asignaciones';
import { MatriculadosPage } from '../matriculados/matriculados';
import {FirestoreTemasProvider} from '../../providers/firestore-temas/firestore-temas';
import {AuthProvider} from '../../providers/auth/auth';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProgramaSemanalPage;
  tab2Root = MatriculadosPage;
  tab3Root = MisAsignacionesPage;
  cantAsignaciones:number;
  constructor(private firestoreTProvider:FirestoreTemasProvider,
              private authProvider:AuthProvider) {
    this.firestoreTProvider.obtenerAsignacionesHermanoActuales(this.authProvider.currentUser.hid).subscribe(asignaciones=>{
      this.cantAsignaciones=asignaciones.length;
    })
  }
}
