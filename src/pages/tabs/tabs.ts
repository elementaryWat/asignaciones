import { Component } from '@angular/core';

import { ProgramaSemanalPage } from '../programa-semanal/programa-semanal';
import { ContactPage } from '../contact/contact';
import { AboutPage } from '../about/about';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProgramaSemanalPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
