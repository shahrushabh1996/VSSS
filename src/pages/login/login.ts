import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Device } from '@ionic-native/device';
import { HomePage } from '../home/home';
import { HeaderColor } from '@ionic-native/header-color';
import 'rxjs/add/operator/map';

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

  login = {
    mobile: {color: 'white_color', label: 'Mobile number (મોબાઇલ નંબર)*', required: 'Please enter mobile number (મોબાઇલ નંબર દાખલ કરો)', default_label: 'Mobile number (મોબાઇલ નંબર)*', value: ''},
    password: {color: 'white_color', label: 'Password (પાસવર્ડ)*', required: 'Please enter password (પાસવર્ડ દાખલ કરો)', default_label: 'Password (પાસવર્ડ)*', value: ''},
    IMEI: {value: ''}
  };

  Loader: any = 1;

  input_values = [];

  required = {
    mobile: '',
    password: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public device: Device, public http: Http, public loadingCtrl: LoadingController, public platform: Platform, public headerColor: HeaderColor) {
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.login['IMEI']['value'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
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
      var link = 'https://www.vsss.co.in/Android/login';
      var post_data = JSON.stringify({
        'mobile': this.login['mobile']['value'],
        'password': this.login['password']['value'],
        'IMEI': this.login['IMEI']['value']
      });
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        loading.dismiss();
        if(data == 0){
          alert('Sorry! Login failed please enter valid credential.');
        }
        else if(data == 1){
          alert('Success! Loggedin successfully.');
          this.navCtrl.setRoot(HomePage);
        }
        else if(data == 2){
          this.navCtrl.push('ActivationPage', {
            Mobile: this.login['mobile']['value']
          });
        }
        else{
          alert('We request you to wait till the approval of VSSS for visiting our Website/Application when you will be approved you will informed by SMS/Mail. Thanks Vishal 9824587820');
        }
      });
    }
    /**/
  }

  check_mobile(){
    if(this.login['mobile']['value'] != '' && this.mobile_validation()){
      var link = 'https://www.vsss.co.in/Android/check_mobile';
      var post_data = JSON.stringify({mobile: this.login['mobile']['value']});
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        if(data == 0){
          this.login['mobile']['label'] = 'Mobile number*';
          this.login['mobile']['color'] = 'white_color';
          return true;
        }
        else{
          this.login['mobile']['value'] = '';
          this.login['mobile']['label'] = 'Mobile number not registered.';
          this.login['mobile']['color'] = 'validationerror';
          return false;
        }
      });
    }
  }

  mobile_validation(){
    var mobile = this.login['mobile']['value'].length;
    if(mobile != 10){
      this.login['mobile']['value'] = '';
      this.login['mobile']['color'] = 'validationerror';
      this.login['mobile']['label'] = 'Please enter valid mobile number (Without +91) (માન્ય મોબાઇલ નંબર દાખલ કરો (+91 સિવાય))';
      return false;
    }
    else{
      this.login['mobile']['color'] = 'white_color';
      this.login['mobile']['label'] = this.login['mobile']['default_label'];
      return true;
    }
  }

  validation(){
    var Error_input = [];
    for(var key in this.required) {
      if(this.login[key]['value'] == ''){
        this.login[key]['color'] = 'validationerror';
        this.login[key]['label'] = this.login[key]['required'];
        Error_input.push(key);
      }
      else{
        this.login[key]['color'] = 'white_color';
        this.login[key]['label'] = this.login[key]['default_label'];
      }
    }
    if(Error_input.length == 0){
      return true;
    }
    else{
      return false;
    }
  }

  page_redirect(page):void {
    this.navCtrl.push(page);
  }

}
