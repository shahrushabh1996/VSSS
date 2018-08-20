import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HeaderColor } from '@ionic-native/header-color';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  device_data = {
  	IMEI: ''
  };

  user: any;

  cities: any;

  states: any;

  Loader: any = 1;

  profile = {
    name: {color: 'white_color', label: 'Shop name (દુકાનનું નામ)*', required: 'Please enter shop name (દુકાનનું નામ દાખલ કરો)', default_label: 'Shop name (દુકાનનું નામ)*', value: ''},
    mobile: {color: 'white_color', label: 'Mobile number (મોબાઇલ નંબર) (Without +91) (+91 સિવાય)*', required: 'Please enter mobile number (મોબાઇલ નંબર દાખલ કરો)', default_label: 'Mobile number (મોબાઇલ નંબર) (Without +91) (+91 સિવાય)*', value: '', default: ''},
    email: {color: 'white_color', label: 'Email Address (ઈ - મેઈલ એડ્રેસ)', value: '', default: ''},
    GST_Number: {color: 'white_color', label: 'GST Number (જીએસટી નંબર)', value: ''},
    transport_name: {color: 'white_color', label: 'Transport name (ટ્રાન્સપોર્ટ નું નામ)', value: ''},
    transport_mobile: {color: 'white_color', label: 'Transport mobile number (ટ્રાન્સપોર્ટ નો નંબર)', value: ''},
    address_1: {color: 'white_color', label: 'Address 1 (સરનામું 1)*', required: 'Please enter address 1 (સરનામું 1 દાખલ કરો)', default_label: 'Address 1 (સરનામું 1)*', value: ''},
    address_2: {color: 'white_color', label: 'Address 2 (સરનામું 2)', value: ''},
    City: {color: 'white_color', label: 'City (શહેર)*', required: 'Please select city (શહેર પસંદ કરો)', default_label: 'City (શહેર)*', value: ''},
    State: {color: 'white_color', label: 'State (રાજ્ય)*', required: 'Please select state (રાજ્ય પસંદ કરો)', default_label: 'State (રાજ્ય)*', value: ''},
    shipping_address_1: {color: 'white_color', label: 'Shipping Address line 1 (માલ મોકલવાનું સરનામું ૧)', value: ''},
    shipping_address_2: {color: 'white_color', label: 'Shipping Address line 2 (માલ મોકલવાનું સરનામું ૨)', value: ''},
    shipping_city: {color: 'white_color', label: 'Shipping City (માલ મોકલવાનું શહેર)', value: ''},
    shipping_state: {color: 'white_color', label: 'Shipping State (માલ મોકલવાનું રાજ્ય)', value: ''}
  };

  input_values = [];

  required = {
    name: '',
    mobile: '',
    address_1: '',
    City: '',
    State: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public headerColor: HeaderColor, public platform: Platform, public device: Device) {
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
  	  this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
  	  this.get_data();
  	});
  }

  get_data(){
    var link = 'https://www.vsss.co.in/Android/get_profile';
    var post_data = JSON.stringify({IMEI: this.device_data['IMEI']});
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      this.Loader = 0;
      this.cities = data['Cities'];
      this.states = data['States'];
      this.user = data['User_data'][0]['id'];
      this.profile['name']['value'] = data['User_data'][0]['company'];
      this.profile['mobile']['value'] =  data['User_data'][0]['mobile'];
      this.profile['mobile']['default'] =  data['User_data'][0]['mobile'];
      this.profile['email']['value'] =  data['User_data'][0]['email'];
      this.profile['email']['default'] =  data['User_data'][0]['email'];
      this.profile['GST_Number']['value'] =  data['User_data'][0]['GST'];
      this.profile['transport_name']['value'] =  data['User_data'][0]['transport_name'];
      this.profile['transport_mobile']['value'] =  data['User_data'][0]['transport_mobile'];     
      this.profile['address_1']['value'] =  data['User_data'][0]['address_1'];     
      this.profile['address_2']['value'] =  data['User_data'][0]['address_2'];     
      this.profile['City']['value'] =  data['User_data'][0]['city'];     
      this.profile['State']['value'] =  data['User_data'][0]['state'];     
      this.profile['shipping_address_1']['value'] =  data['User_data'][0]['shipping_address_1'];     
      this.profile['shipping_address_2']['value'] =  data['User_data'][0]['shipping_address_2'];     
      this.profile['shipping_city']['value'] =  data['User_data'][0]['shipping_city'];     
      this.profile['shipping_state']['value'] =  data['User_data'][0]['shipping_state'];
    });
  }

  submit_form(){
    if(this.validation()){
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Please wait while we submit form.'
      });
      loading.present();
      var link = 'https://www.vsss.co.in/Android/submit_profile';
      var post_data = JSON.stringify(
        {
          'ID': this.user,
          'name': this.profile['name']['value'],
          'mobile': this.profile['mobile']['value'],
          'email': this.profile['email']['value'],
          'GST_Number': this.profile['GST_Number']['value'],
          'transport_name': this.profile['transport_name']['value'],
          'transport_mobile': this.profile['transport_mobile']['value'],
          'address_1': this.profile['address_1']['value'],
          'address_2': this.profile['address_2']['value'],
          'City': this.profile['City']['value'],
          'State': this.profile['State']['value'],
          'shipping_address_1': this.profile['shipping_address_1']['value'],
          'shipping_address_2': this.profile['shipping_address_2']['value'],
          'shipping_city': this.profile['shipping_city']['value'],
          'shipping_state': this.profile['shipping_state']['value']
        }
      );
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        loading.dismiss();
        alert('Profile updated');
        this.navCtrl.setRoot(HomePage);
      });
    }
  }

  select_state(field){
    var selected_city = this.profile[field]['value'];
    var Selected_state = '';
    var City_name = '';
    this.cities.filter(function(element, index) {
      if(element.ID == selected_city){
        Selected_state = element.State;
        City_name = element.Name;
      }
    });
    if(field == 'City'){
      this.profile['State']['value'] = Selected_state;
    }
    else{
      this.profile['shipping_state']['value'] = Selected_state;
    }
  }

  check_mobile(){
    if(this.profile['mobile']['value'] != '' && this.mobile_validation() && this.profile['mobile']['value'] != this.profile['mobile']['default']){
      var link = 'https://www.vsss.co.in/Android/check_mobile';
      var post_data = JSON.stringify({mobile: this.profile['mobile']['value']});
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        if(data == 0){
          this.profile['mobile']['value'] = '';
          this.profile['mobile']['label'] = 'Mobile number already exist.';
          this.profile['mobile']['color'] = 'validationerror';
          return false;
        }
        else{
          this.profile['mobile']['label'] = this.profile['mobile']['default_label'];
          this.profile['mobile']['color'] = 'white_color';
          return true;
        }
      });
    }
  }

  check_email(){
    if(this.profile['email']['value'] != '' && this.email_validation() && this.profile['email']['value'] != this.profile['email']['default']){
      var link = 'https://www.vsss.co.in/Android/check_email';
      var post_data = JSON.stringify({email: this.profile['email']['value']});
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        if(data == 0){
          this.profile['email']['value'] = '';
          this.profile['email']['label'] = 'Email address already exist.';
          this.profile['email']['color'] = 'validationerror';
          return false;
        }
        else{
          this.profile['email']['label'] = this.profile['email']['default_label'];
          this.profile['email']['color'] = 'white_color';
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
      if(this.profile[key]['value'] == ''){
        this.profile[key]['color'] = 'validationerror';
        this.profile[key]['label'] = this.profile[key]['required'];
        Error_input.push(key);
      }
      else{
        this.profile[key]['color'] = 'white_color';
        this.profile[key]['label'] = this.profile[key]['default_label'];
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
    var mobile = this.profile['mobile']['value'].length;
    if(mobile != 10){
      this.profile['mobile']['value'] = '';
      this.profile['mobile']['color'] = 'validationerror';
      this.profile['mobile']['label'] = 'Please enter valid mobile number (Without +91) (માન્ય મોબાઇલ નંબર દાખલ કરો (+91 સિવાય))';
      return false;
    }
    else{
      this.profile['mobile']['color'] = 'white_color';
      this.profile['mobile']['label'] = this.profile['mobile']['default_label'];
      return true;
    }
  }

  email_validation(){
    var email = this.profile['email']['value'];
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!regex.test(email)){
      this.profile['email']['value'] = '';
      this.profile['email']['color'] = 'validationerror';
      this.profile['email']['label'] = 'Please enter valid email address (માન્ય ઇમેઇલ એડ્રેસ દાખલ કરો)';
      return false;
    }
    else{
      this.profile['email']['color'] = 'white_color';
      this.profile['email']['label'] = this.profile['email']['default_label'];
      return true;
    }
  }

}
