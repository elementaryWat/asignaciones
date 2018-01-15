import { Component } from '@angular/core';
import { Platform,
         ToastController,
         Toast } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import {Subscription} from 'rxjs/Subscription';

import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login';
import {AuthProvider} from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  toast:Toast;
  disconnectSubscription:Subscription;
  connectSubscription:Subscription;
  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private authProvider:AuthProvider,
              private toastCtrl:ToastController,
              private network: Network) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      authProvider.estadoLogged.subscribe(estado=>{
                                              console.log(estado);
                                              if(estado){
                                                this.rootPage=TabsPage
                                              }else{
                                                this.rootPage=LoginPage
                                              }
                                          });
        this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
          authProvider.estadoLogged.next(false);
          this.presentToast("No hay conexión a internet :-(");
        });
        this.connectSubscription = this.network.onConnect().subscribe(() => {
          console.log('network connected!');
          if (this.toast){
            this.toast.dismiss();
          }
        });
    });
  }
  presentToast(mensaje:string) {
    if (this.toast){
      this.toast.dismiss();
    }
    this.toast = this.toastCtrl.create({
        message: mensaje,
        position: 'bottom',
        showCloseButton:true,
        closeButtonText:"OK"
      });
     this.toast.present();
   }
   ionViewDidLeave(){
     if (this.toast){
       this.toast.dismiss();
     }
     this.connectSubscription.unsubscribe();
     this.disconnectSubscription.unsubscribe();
   }
}
