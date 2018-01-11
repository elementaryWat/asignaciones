import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import {Credencial} from '../../app/interfaces/credencial.interface';
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
  formLogin:FormGroup;
  constructor(private authProvider:AuthProvider,
              private toastCtrl:ToastController) {
    this.formLogin=new FormGroup({
      'email':new FormControl('',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]),
      'password':new FormControl('',Validators.required),
    });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad LoginPage');
  // }
  login(){
    console.log(this.formLogin);
    if (this.formLogin.valid){

    }
    else{
      if(this.formLogin.controls['email'].errors && this.formLogin.controls['password'].errors && this.formLogin.controls['email'].errors.required && this.formLogin.controls['password'].errors.required){
        this.presentToast("Debe ingresar sus datos");
      }else if(this.formLogin.controls['email'].errors && this.formLogin.controls['email'].errors.pattern){
        this.presentToast("Formato de correo invalido");
      }else if (this.formLogin.controls['email'].errors && this.formLogin.controls['email'].errors.required){
        this.presentToast("Debe ingresar su email");
      }else if (this.formLogin.controls['password'].errors && this.formLogin.controls['password'].errors.required){
        this.presentToast("Debe ingresar su contraseña");
      }
    }
  }
  presentToast(mensaje:string) {
   let toast = this.toastCtrl.create({
       message: mensaje,
       position: 'bottom',
       showCloseButton:true,
       closeButtonText:"OK"
     });

     toast.present();
   }
}
