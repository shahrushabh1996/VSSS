import { Directive, HostListener } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Http } from '@angular/http';
import { HomePage } from '../../pages/home/home';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the UserDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[vsss-user]' // Attribute selector
})
export class UserDirective {

  device_data = {
    IMEI: ''
  };

  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public device: Device, public http: Http, public platform: Platform, public loadingCtrl: LoadingController) {
  }

  @HostListener('click') onClick() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'English',
          handler: () => {
            console.log('English');
          }
        },{
          text: 'Gujarati',
          handler: () => {
            console.log('Gujarati');
          }
        },{
          text: 'Order history',
          handler: () => {
            this.navCtrl.push('OrderPage');
          }
        },{
          text: 'Change password',
          handler: () => {
            this.navCtrl.push('ChangepasswordPage');
          }
        },{
          text: 'Logout',
          handler: () => {
            let loading = this.loadingCtrl.create({
              spinner: 'crescent',
              content: 'Please wait.'
            });
            loading.present();
            this.platform.ready().then(() => {
              this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
              var link = 'https://www.vsss.co.in/Android/logout';
              var post_data = JSON.stringify({IMEI: this.device_data['IMEI']});
              this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
                loading.dismiss();
                this.navCtrl.setRoot(HomePage);
              });
            });
          }
        }
      ]
    });
    actionSheet.present();
  }

}
