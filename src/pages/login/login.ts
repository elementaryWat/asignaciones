import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';
import {Credencial} from '../../app/interfaces/credencial.interface';
import {NgForm} from '@angular/forms';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credenciales:Credencial={
    email:"",
    password:""
  }
  constructor(private authProvider:AuthProvider) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad LoginPage');
  // }
  login(loginForm:NgForm){
    console.log(loginForm);
  }
}
