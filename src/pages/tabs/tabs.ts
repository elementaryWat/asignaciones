import { Component } from '@angular/core';

import { ProgramaSemanalPage } from '../programa-semanal/programa-semanal';
import { MisAsignacionesPage } from '../mis-asignaciones/mis-asignaciones';
import { MatriculadosPage } from '../matriculados/matriculados';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProgramaSemanalPage;
  tab2Root = MatriculadosPage;
  tab3Root = MisAsignacionesPage;

  constructor() {

  }
}
