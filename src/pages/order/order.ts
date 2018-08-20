import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, Content } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Device } from '@ionic-native/device';
import { Http } from '@angular/http';
import { DataProvider } from '../../providers/data/data';
import { HeaderColor } from '@ionic-native/header-color';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  @ViewChild(Content) content: Content;

  device_data = {
    IMEI: ''
  };

  cart_item: any = 0;

  pagination: any;

  orders: any;

  sorting_class = {
    Default: 'button button-md button-default button-default-md button-round button-round-md active',
    Name_asc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Name_desc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Price_asc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Price_desc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Date_desc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Date_asc: 'button button-md button-default button-default-md button-round button-round-md disable'
  }

  active_sorting = 'Default';

  active_page_number = 0;

  searchTerm: string = '';

  Loader: any = 0;

  segment: any = '';

  language: string = '';

  ion_content: any = 'page_blue';

  constructor(public navCtrl: NavController, public navParams: NavParams, public device: Device, public http: Http, public platform: Platform, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public dataService: DataProvider, public headerColor: HeaderColor, public translate: TranslateService) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExamplePage');
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
      this.get_item();
      this.ion_content = '';
      this.Loader = 0;
    });
  }

  get_item(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/get_order';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      order: this.active_sorting,
      page: this.active_page_number
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.orders = data['Orders'];
      this.cart_item = data['Cart_items'];
      this.language = data['Language'];
      this.translate.use(this.language);
      this.modify_json();
      this.generate_pagination(data['Total']);
    });
  }

  modify_json(){
    for(let key in this.orders) {
      this.orders[key]['Sub_total'] = parseFloat(this.orders[key]['Sub_total']).toFixed(2);
      this.orders[key]['GST'] = parseFloat(this.orders[key]['GST']).toFixed(2);
      this.orders[key]['Discount'] = parseFloat(this.orders[key]['Discount']).toFixed(2);
      this.orders[key]['Shipping'] = parseFloat(this.orders[key]['Shipping']).toFixed(2);
      this.orders[key]['Total'] = parseFloat(this.orders[key]['Total']).toFixed(2);
    }
  }

  active_sort(sort){
    for(let key in this.sorting_class) {
      this.sorting_class[key] = 'button button-md button-default button-default-md button-round button-round-md disable';
    }
    this.sorting_class[sort] = 'button button-md button-default button-default-md button-round button-round-md active';
    this.active_sorting = sort;
    this.get_item();
  }

  generate_pagination(Total){
    if(typeof this.pagination === 'undefined'){
      this.pagination = [];
      for (var i = 0; i <= Total; i++) {
        this.pagination[i] = {class: '', value: i};
      }
      if(this.pagination[1] !== void 0){
        this.pagination[1]['class'] = 'active';
      }
      this.pagination.splice(0, 1);
    }
  }

  active_page(page_number){
    for(var page in this.pagination) {
      if(this.pagination[page]['value'] == page_number){
        this.pagination[page]['class'] = 'active';
        this.active_page_number = page_number-1;
      }
      else{
        this.pagination[page]['class'] = ''
      }
    }
    this.get_item();
  }

  export(link){
    window.open(link, '_system', 'location=yes'); 
    return false;
  }

  view_order(ID){
    this.navCtrl.push('OrderitemPage', {
      id: ID
    });
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
  }

}
