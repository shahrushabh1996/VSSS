import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login';
import { HeaderColor } from '@ionic-native/header-color';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import 'rxjs/add/operator/map';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  cities: any;

  states: any;

  Loader: any = 1;

  signup = {
    name: {color: 'white_color', label: 'Shop name (દુકાનનું નામ)*', required: 'Please enter shop name (દુકાનનું નામ દાખલ કરો)', default_label: 'Shop name (દુકાનનું નામ)*', value: ''},
    mobile: {color: 'white_color', label: 'Mobile number  (મોબાઇલ નંબર) (Without +91) (+91 સિવાય)*', required: 'Please enter mobile number (મોબાઇલ નંબર દાખલ કરો)', default_label: 'Mobile number (મોબાઇલ નંબર) (Without +91)  (+91 સિવાય)*', value: ''},
    email: {color: 'white_color', label: 'Email Address (ઈ - મેઈલ એડ્રેસ)', value: ''},
    GST_Number: {color: 'white_color', label: 'GST Number (જીએસટી નંબર)', value: ''},
    transport_name: {color: 'white_color', label: 'Transport name (ટ્રાન્સપોર્ટ નું નામ)', value: ''},
    transport_mobile: {color: 'white_color', label: 'Transport mobile number (ટ્રાન્સપોર્ટ નો નંબર)', value: ''},
    address_1: {color: 'white_color', label: 'Address 1 (સરનામું 1)*', required: 'Please enter address 1 (સરનામું 1 દાખલ કરો)', default_label: 'Address 1 (સરનામું 1)*', value: ''},
    address_2: {color: 'white_color', label: 'Address 2 (સરનામું 2)', value: ''},
    City: {color: 'white_color', label: 'City (શહેર)*', required: 'Please select city (શહેર પસંદ કરો)', default_label: 'City (શહેર)*', value: '', name: ''},
    State: {color: 'white_color', label: 'State (રાજ્ય)*', required: 'Please select state (રાજ્ય પસંદ કરો)', default_label: 'State (રાજ્ય)*', value: '', name: ''},
    shipping_address_1: {color: 'white_color', label: 'Shipping Address line 1 (માલ મોકલવાનું સરનામું ૧)', value: ''},
    shipping_address_2: {color: 'white_color', label: 'Shipping Address line 2 (માલ મોકલવાનું સરનામું ૨)', value: ''},
    shipping_city: {color: 'white_color', label: 'Shipping City (માલ મોકલવાનું શહેર)', value: ''},
    shipping_state: {color: 'white_color', label: 'Shipping State (માલ મોકલવાનું રાજ્ય)', value: ''},
    password: {color: 'white_color', label: 'Password (પાસવર્ડ)*', required: 'Please enter password (પાસવર્ડ દાખલ કરો)', default_label: 'Password (પાસવર્ડ)*', value: ''},
    confirm_password: {color: 'white_color', label: 'Confirm password (પાસવર્ડ કન્ફર્મ કરો)*', required: 'Please enter confirm password (પાસવર્ડ કન્ફર્મ કરો)', default_label: 'Confirm password (પાસવર્ડ કન્ફર્મ કરો)*', value: ''}
  };

  input_values = [];

  required = {
    name: '',
    mobile: '',
    address_1: '',
    City: '',
    State: '',
    password: '',
    confirm_password: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public headerColor: HeaderColor) {
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  ionViewWillEnter(){
    this.http.get('https://www.vsss.co.in/Android/get_city_state').map(res => res.json()).subscribe(data => {
        this.cities = data.Cities;
        this.states = data.States;
        this.Loader = 0;
    });
  }

  portChange(){
    alert('Changed');
  }

  submit_form(){
    if(this.validation()){
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Please wait while we submit form.'
      });
      loading.present();
      var link = 'https://www.vsss.co.in/Android/signup';
      var post_data = JSON.stringify(
        {
          'name': this.signup['name']['value'],
          'mobile': this.signup['mobile']['value'],
          'email': this.signup['email']['value'],
          'GST_Number': this.signup['GST_Number']['value'],
          'transport_name': this.signup['transport_name']['value'],
          'transport_mobile': this.signup['transport_mobile']['value'],
          'address_1': this.signup['address_1']['value'],
          'address_2': this.signup['address_2']['value'],
          'City': this.signup['City']['value']['ID'],
          'City_name': this.signup['City']['value']['Name'],
          'State': this.signup['State']['value']['ID'],
          'State_name': this.signup['State']['value']['Name'],
          'shipping_address_1': this.signup['shipping_address_1']['value'],
          'shipping_address_2': this.signup['shipping_address_2']['value'],
          'shipping_city': this.signup['shipping_city']['value']['ID'],
          'shipping_city_name': this.signup['shipping_city']['value']['name'],
          'shipping_state': this.signup['shipping_state']['value']['ID'],
          'shipping_state_name': this.signup['shipping_state']['value']['name'],
          'password': this.signup['password']['value'],
          'confirm_password': this.signup['confirm_password']['value']
        }
      );
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        loading.dismiss();
        if(data == 1){
          this.navCtrl.push('LoginPage');
          /*this.navCtrl.push('ActivationPage', {
            Mobile: this.signup['mobile']['value']
          });*/
        }
      });
    }
  }

  select_state(field){
    var selected_city = this.signup[field]['value']['ID'];
    var Selected_state = '';
    var State_index = '';
    var City_name = '';
    this.cities.filter(function(element, index) {
      if(element.ID == selected_city){
        Selected_state = element.State;
        City_name = element.Name;
      }
    });
    this.states.filter(function(element, index) {
      if(element.ID == Selected_state){
        State_index = index;
      }
    });
    if(field == 'City'){
      this.signup['State']['value'] = this.states[State_index];
      this.signup['City']['name'] = City_name.toLowerCase();
      this.state_name('State');
    }
    else{
      this.signup['shipping_state']['value'] = this.states[State_index];
      this.signup['shipping_city']['name'] = City_name.toLowerCase();
      this.state_name('shipping_state');
    }
  }

  state_name(field){
    var selected_state = this.signup[field]['value'];
    var State_name = '';
    this.states.filter(function(element, index) {
      if(element.ID == selected_state){
        State_name = element.Name;
      }
    });
    this.signup[field]['name'] = State_name.toLowerCase();
  }

  check_mobile(){
    if(this.signup['mobile']['value'] != '' && this.mobile_validation()){
      var link = 'https://www.vsss.co.in/Android/check_mobile';
      var post_data = JSON.stringify({mobile: this.signup['mobile']['value']});
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        if(data == 0){
          this.signup['mobile']['value'] = '';
          this.signup['mobile']['label'] = 'Mobile number already exist.';
          this.signup['mobile']['color'] = 'validationerror';
          return false;
        }
        else{
          this.signup['mobile']['label'] = this.signup['mobile']['default_label'];
          this.signup['mobile']['color'] = 'white_color';
          return true;
        }
      });
    }
  }

  check_email(){
    if(this.signup['email']['value'] != '' && this.email_validation()){
      var link = 'https://www.vsss.co.in/Android/check_email';
      var post_data = JSON.stringify({email: this.signup['email']['value']});
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        if(data == 0){
          this.signup['email']['value'] = '';
          this.signup['email']['label'] = 'Email address already exist.';
          this.signup['email']['color'] = 'validationerror';
          return false;
        }
        else{
          this.signup['email']['label'] = this.signup['email']['default_label'];
          this.signup['email']['color'] = 'white_color';
          return true;
        }
      });
    }
    else{
      return false;
    }
  }

  validation(){
    var Error_input = [];
    for(var key in this.required) {
      if(this.signup[key]['value'] == ''){
        this.signup[key]['color'] = 'validationerror';
        this.signup[key]['label'] = this.signup[key]['required'];
        Error_input.push(key);
      }
      else{
        this.signup[key]['color'] = 'white_color';
        this.signup[key]['label'] = this.signup[key]['default_label'];
      }
    }
    if(Error_input.length == 0){
      return true;
    }
    else{
      return false;
    }
  }

  mobile_validation(){
    var mobile = this.signup['mobile']['value'].length;
    if(mobile != 10){
      this.signup['mobile']['value'] = '';
      this.signup['mobile']['color'] = 'validationerror';
      this.signup['mobile']['label'] = 'Please enter valid mobile number (Without +91) (માન્ય મોબાઇલ નંબર દાખલ કરો (+91 સિવાય))';
      return false;
    }
    else{
      this.signup['mobile']['color'] = 'white_color';
      this.signup['mobile']['label'] = this.signup['mobile']['default_label'];
      return true;
    }
  }

  email_validation(){
    var email = this.signup['email']['value'];
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!regex.test(email)){
      this.signup['email']['value'] = '';
      this.signup['email']['color'] = 'validationerror';
      this.signup['email']['label'] = 'Please enter valid email address';
      return false;
    }
    else{
      this.signup['email']['color'] = 'white_color';
      this.signup['email']['label'] = this.signup['email']['default_label'];
      return true;
    }
  }

  page_redirect(page):void {
    this.navCtrl.push(page);
  }

}
