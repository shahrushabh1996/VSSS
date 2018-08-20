import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { HeaderColor } from '@ionic-native/header-color';

/**
 * Generated class for the ActivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activation',
  templateUrl: 'activation.html',
})
export class ActivationPage {

	activation = {
    Activation_code: {color: 'white_color', label: 'activation code*', required: 'Please enter activation code', default_label: 'activation code*', value: ''},
    Mobile: {value: '7990089984'}
	}

	required = {
	  Activation_code: ''
	}

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public headerColor: HeaderColor) {
    this.activation['Mobile']['value'] = navParams.get('Mobile');
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivationPage');
  }

  ionViewWillEnter(){}

  submit_form(){
  	if(this.validation()){
	  	let loading = this.loadingCtrl.create({
	        spinner: 'crescent',
	        content: 'Please wait while we submit form.'
	    });
	    loading.present();
		  var link = 'https://www.vsss.co.in/Android/activation';
	    var post_data = JSON.stringify({
	      'Activation_code': this.activation['Activation_code']['value'],
        'Mobile': this.activation['Mobile']['value']
	    });
  		this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        loading.dismiss();
        if(data == 1){
          alert('Success! your account successfully activated.');
          this.navCtrl.push('LoginPage');
        }
        else{
          alert('Sorry! please enter valid activation code.')
        }
  	  });
    }
  }

  validation(){
    var Error_input = [];
    for(var key in this.required) {
      if(this.activation[key]['value'] == ''){
        this.activation[key]['color'] = 'validationerror';
        this.activation[key]['label'] = this.activation[key]['required'];
        Error_input.push(key);
      }
      else{
        this.activation[key]['color'] = 'white_color';
        this.activation[key]['label'] = this.activation[key]['default_label'];
      }
    }
    if(Error_input.length == 0){
      return true;
    }
    else{
      return false;
    }
  }

}
