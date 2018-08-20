import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Device } from '@ionic-native/device';
import { HeaderColor } from '@ionic-native/header-color';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  @ViewChild(Content) content: Content;

  @ViewChild('input') myInput ;

  device_data = {
    IMEI: ''
  };

  cart_item: any = 0;

  searchTerm: any = '';

  language: string = '';

  Items: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public headerColor: HeaderColor, public http: Http, public platform: Platform, public loadingCtrl: LoadingController, public device: Device, public translate: TranslateService) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    setTimeout(() => {
      this.myInput.setFocus();
    }, 1500);
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
      this.count_cart_item();
    });
  }

  count_cart_item(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/count_cart_item';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI']
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.cart_item = data['Cart_items'];
      this.language = data['Language'];
      this.translate.use(this.language);
    });
  }

  apply_search(){
    this.content.scrollToTop();
    var link = 'https://www.vsss.co.in/Android/Search';
    var post_data = JSON.stringify({
      Query: this.searchTerm
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      this.Items = data;
    });
  }

  open(ID, Type){
    switch(Type){
      case 'Item':
      this.navCtrl.push('DetailPage', {
        id: ID
      });
      break;
      case 'Category':
      this.navCtrl.push('CategoryItemPage', {
        id: ID
      });
      break;
      case 'Sub category':
      this.navCtrl.push('SubCategoryItemPage', {
        id: ID
      });
      break;
      default:
      this.navCtrl.push('SearchItemPage', {
        Query: this.searchTerm
      });
    }
  }

  page_redirect(page){
  	this.navCtrl.push(page);
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
  }

}
