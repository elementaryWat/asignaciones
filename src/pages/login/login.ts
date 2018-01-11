import { Component } from '@angular/core';
import { IonicPage, ToastController, LoadingController, Loading } from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  loader:Loading;
  constructor(private authProvider:AuthProvider,
              private toastCtrl:ToastController,
              private formBuilder:FormBuilder,
              private loadingCtrl:LoadingController) {
    this.formLogin=this.formBuilder.group({
      'email':['',[Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      'password':['',Validators.required],
    });
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad LoginPage');
  // }
  login(){
    //console.log(this.formLogin);
    this.presentLoading();
    if (this.formLogin.valid){
      this.authProvider.login({
        email:this.formLogin.controls['email'].value,
        password:this.formLogin.controls['password'].value
      }).subscribe(data=>{
        this.loader.dismiss();
        if (data.length!=0){
          this.authProvider.currentUser=data[0];
          this.authProvider.estadoLogged.next(true);
        }else{
          this.presentToast("Email o contraseña invalidos");
        }

      });
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
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Por favor espere..."
    });
    this.loader.present();
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
