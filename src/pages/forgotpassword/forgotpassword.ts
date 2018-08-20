import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { HeaderColor } from '@ionic-native/header-color';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  forgotpassword = {
    forgot_mobile: {color: 'white_color', label: 'Mobile number (મોબાઇલ નંબર)*', required: 'Please enter mobile number (મોબાઇલ નંબર દાખલ કરો)', default_label: 'Mobile number (મોબાઇલ નંબર)*', value: ''}
  };

  required = {
    forgot_mobile: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public headerColor: HeaderColor) {
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  ionViewWillEnter(){}

  submit_form(){
    if(this.validation()){
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Please wait while we submit form.'
      });
      loading.present();
      var link = 'https://www.vsss.co.in/Android/forgot_password';
      var post_data = JSON.stringify({
        'forgot_mobile': this.forgotpassword['forgot_mobile']['value']
      });
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        if(data == 1){
          alert('Success! password sent on registered mobile number.');
          this.navCtrl.push('LoginPage');
        }
        loading.dismiss();
      });
    }
  }

  check_mobile(){
    if(this.forgotpassword['forgot_mobile']['value'] != '' && this.mobile_validation()){
      var link = 'https://www.vsss.co.in/Android/check_mobile';
      var post_data = JSON.stringify({mobile: this.forgotpassword['forgot_mobile']['value']});
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        if(data == 0){
          this.forgotpassword['forgot_mobile']['label'] = 'Mobile number*';
          this.forgotpassword['forgot_mobile']['color'] = 'white_color';
          return true;
        }
        else{
          this.forgotpassword['forgot_mobile']['value'] = '';
          this.forgotpassword['forgot_mobile']['label'] = 'Mobile number not registered.';
          this.forgotpassword['forgot_mobile']['color'] = 'validationerror';
          return false;
        }
      });
    }
  }

  mobile_validation(){
    var mobile = this.forgotpassword['forgot_mobile']['value'].length;
    if(mobile != 10){
      this.forgotpassword['forgot_mobile']['value'] = '';
      this.forgotpassword['forgot_mobile']['color'] = 'validationerror';
      this.forgotpassword['forgot_mobile']['label'] = 'Please enter valid mobile number (Without +91) (માન્ય મોબાઇલ નંબર દાખલ કરો (+91 સિવાય))';
      return false;
    }
    else{
      this.forgotpassword['forgot_mobile']['color'] = 'white_color';
      this.forgotpassword['forgot_mobile']['label'] = this.forgotpassword['forgot_mobile']['default_label'];
      return true;
    }
  }

  validation(){
    var Error_input = [];
    for(var key in this.required) {
      if(this.forgotpassword[key]['value'] == ''){
        this.forgotpassword[key]['color'] = 'validationerror';
        this.forgotpassword[key]['label'] = this.forgotpassword[key]['required'];
        Error_input.push(key);
      }
      else{
        this.forgotpassword[key]['color'] = 'white_color';
        this.forgotpassword[key]['label'] = this.forgotpassword[key]['default_label'];
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
