import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  device_data = {
  	IMEI: ''
  };

  cart_item: any = 0;

  wishlist_item: any = 0;

  ion_content: any = 'page_blue';

  Loader: any = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams,public device: Device, public http: Http, public platform: Platform, public translate: TranslateService) {
    this.translate.setDefaultLang('english');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
      this.get_data();
    });
  }

  get_data(){
    var link = 'https://www.vsss.co.in/Android/get_user_data';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI']
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      this.cart_item = data['Cart_items'];
      this.wishlist_item = data['Wishlist_items'];
      this.translate.use(data['Language']);
      this.ion_content = '';
      this.Loader = 0;
    });
  }

  page_redirect(page){
  	this.navCtrl.push(page);
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
  }

}
