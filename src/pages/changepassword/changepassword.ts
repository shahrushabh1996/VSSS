import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Http } from '@angular/http';
import { HeaderColor } from '@ionic-native/header-color';

/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

  changepassword = {
    old_password: {color: 'white_color', label: 'Old password (જુનો પાસવર્ડ)*', required: 'Please enter old password (કૃપા કરીને જૂનો પાસવર્ડ દાખલ કરો)', default_label: 'Old password (જુનો પાસવર્ડ)*', value: ''},
    new_password: {color: 'white_color', label: 'New password (નવો પાસવર્ડ)*', required: 'Please enter new password (કૃપા કરીને નવો પાસવર્ડ દાખલ કરો)', default_label: 'New password (નવો પાસવર્ડ)*', value: ''}
  };

  device_data = {
    IMEI: ''
  };

  required = {
    old_password: '',
    new_password: ''
  }

  Loader: any = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public device: Device, public platform: Platform, public headerColor: HeaderColor) {
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
      this.Loader = 0;
    });
  }

  submit_form(){
    if(this.validation()){
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Please wait while we submit form.'
      });
      loading.present();
      var link = 'https://www.vsss.co.in/Android/change_password';
      var post_data = JSON.stringify({
        old_password: this.changepassword['old_password']['value'],
        new_password: this.changepassword['new_password']['value'],
        IMEI: this.device_data['IMEI']
      });
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        loading.dismiss();
        if(data == 1){
          alert('Success! password successfully changed.');
          this.navCtrl.popToRoot();
        }
        else{
          alert('Sorry! password not changed. Please enter valid password.');
        }
      });
    }
    /**/
  }

  validation(){
    var Error_input = [];
    for(var key in this.required) {
      if(this.changepassword[key]['value'] == ''){
        this.changepassword[key]['color'] = 'validationerror';
        this.changepassword[key]['label'] = this.changepassword[key]['required'];
        Error_input.push(key);
      }
      else{
        this.changepassword[key]['color'] = 'white_color';
        this.changepassword[key]['label'] = this.changepassword[key]['default_label'];
      }
    }
    if(Error_input.length == 0){
      return true;
    }
    else{
      return false;
    }
  }

  go_back(){
    this.navCtrl.pop();
  }

}
