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
  selector: 'page-orderitem',
  templateUrl: 'orderitem.html',
})
export class OrderitemPage {

  @ViewChild(Content) content: Content;

  device_data = {
    IMEI: ''
  };

  cart_item: any = 0;

  pagination: any;

  items: any;

  search_items: any;

  order_number: any;

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

  Loader: any = 1

  segment: any = '';

  language: string = '';

  ion_content: any = 'page_blue';

  prev_page: string = 'hide';

  next_page: string = 'hide';

  active_slot = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public device: Device, public http: Http, public platform: Platform, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public dataService: DataProvider, public headerColor: HeaderColor, public translate: TranslateService) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
    this.order_number = navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
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
    var link = 'https://www.vsss.co.in/Android/get_order_item';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      order: this.active_sorting,
      page: this.active_page_number,
      order_number: this.order_number,
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.items = data['Items'];
      this.cart_item = data['Cart_items'];
      this.language = data['Language'];
      this.translate.use(this.language);
      this.modify_json();
      this.generate_pagination(data['Total']);
    });
  }

  modify_json(){
    for(let key in this.items) {
      this.items[key]['Rate'] = parseFloat(this.items[key]['Rate']).toFixed(2);
      let amount_GST = Number((this.items[key]['Rate'] * this.items[key]['IGST']) / 100);
      let amount_discount = Number(((Number(this.items[key]['Rate']) + amount_GST) * Number(this.items[key]['Discount'])) / 100);
      this.items[key]['Amount'] = (((Number(this.items[key]['Rate']) + amount_GST) - amount_discount) * Number(this.items[key]['Quantity'])).toFixed(2);
      this.items[key]['Image'] = this.items[key]['Image'] === null ? [] : this.items[key]['Image'].split(',');
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

  open_detail(item){
    this.navCtrl.push('DetailPage', {
      id: item
    });
  }

  sharing(name, MRP, GST, image){
    event.stopPropagation();
    this.socialSharing.share('Name: '+name+' MRP: Rs. '+MRP+' GST: '+GST+'%', '', image);
  }

  setFilteredOrderItem(){
    this.content.scrollToTop();
    this.items = this.dataService.filterOrderItems(this.searchTerm, this.items);
  }

  generate_pagination(Total){
    if(typeof this.pagination === 'undefined'){
      this.pagination = [];
      for (var i = 0; i <= Total; i++) {
        this.pagination[i] = i <= 5 ? {class: 'show', value: i} : {class: 'hide', value: i} ;
      }
      if(this.pagination[1] !== void 0){
        this.pagination[1]['class'] = 'active';
      }
      Total > 5 ? this.next_page = 'show' : this.next_page = 'hide';
      this.pagination.splice(0, 1);
    }
  }

  next_page_pagination(){
    //First Hide previous pages then show next pages
    for (var i = (this.active_slot * 5); i <= ((this.active_slot * 5) + 4); i++) {
      if(typeof this.pagination[i] !== 'undefined'){
        this.pagination[i]['class'] = 'hide';
      }
    }
    this.active_slot++;
    this.prev_page = 'show';
    for (var i = (this.active_slot * 5); i <= ((this.active_slot * 5) + 4); i++) {
      if(typeof this.pagination[i] !== 'undefined'){
        i == this.active_page_number ? this.pagination[i]['class'] = 'show active' : this.pagination[i]['class'] = 'show';
      }
    }
    if(this.active_slot == Math.ceil((this.pagination.length / 5) - 1)){
      this.next_page = 'hide';
    }
  }

  prev_page_pagination(){
    //First Hide previous pages then show next pages
    for (var i = (this.active_slot * 5); i <= (((this.active_slot + 1) * 5) - 1); i++) {
      if(typeof this.pagination[i] !== 'undefined'){
        this.pagination[i]['class'] = 'hide';
      }
    }
    this.active_slot--;
    this.next_page = 'show';
    for (var i = (this.active_slot * 5); i <= (((this.active_slot + 1) * 5) - 1); i++) {
      if(typeof this.pagination[i] !== 'undefined'){
        i == this.active_page_number ? this.pagination[i]['class'] = 'show active' : this.pagination[i]['class'] = 'show';
      }
    }
    if(this.active_slot == 0){
      this.prev_page = 'hide';
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

  cancel_item(index){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/cancel_order_item';
    var post_data = JSON.stringify({
      order_item: this.items[index]['ID']
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.items[index]['Status'] = 'Cancelled';
    });
  }

  page_redirect(page){
  	this.navCtrl.push(page);
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
  }

}
