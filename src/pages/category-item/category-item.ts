import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, Content } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Device } from '@ionic-native/device';
import { Http } from '@angular/http';
import { HeaderColor } from '@ionic-native/header-color';
import { TranslateService } from '@ngx-translate/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';

/**
 * Generated class for the CategoryItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-item',
  templateUrl: 'category-item.html',
})
export class CategoryItemPage {

  @ViewChild(Content) content: Content;

  device_data = {
    IMEI: ''
  };

  pagination: any;

  items: any;

  cart_item: any = 0;

  category = '';

  CategoryName: string;

  CategoryNameGujarati: string;

  language: string = '';

  segment = 'Item';

  Loader: any = 1;

  ion_content: string = 'page_blue';

  sorting_class = {
    Default: 'button button-md button-default button-default-md button-round button-round-md active',
    Name_asc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Name_desc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Price_asc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Price_desc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Date_desc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Date_asc: 'button button-md button-default button-default-md button-round button-round-md disable'
  }

  scroll_top = true;

  active_sorting = 'Default';

  active_page_number = 0;

  prev_page: string = 'hide';

  next_page: string = 'hide';

  active_slot = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public device: Device, public http: Http, public platform: Platform, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public headerColor: HeaderColor, public translate: TranslateService, public barcodeScanner: BarcodeScanner) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
    this.category = navParams.get('id');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryItemPage');
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
      this.scroll_top = false;
      this.get_sub_category();
      this.get_item();
    });
  }

  get_sub_category(){
    var link = 'https://www.vsss.co.in/Android/get_sub_category';
    var post_data = JSON.stringify(
        {
          'IMEI': this.device_data['IMEI'],
          'id': this.category
        }
    );
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        this.CategoryName = data['Category'].toLowerCase();
        this.CategoryNameGujarati = data['Category_gujarati'];
        this.cart_item = data['Cart_items'];
        this.Loader = 0;
        this.ion_content = '';
    });
  }

  get_item(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/get_item';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      type: 'Category',
      value: this.category,
      order: this.active_sorting,
      page: this.active_page_number
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.items = data['Items'];
      this.language = data['Language'];
      this.translate.use(this.language);
      this.modify_json();
      this.generate_pagination(data['Total']);
      this.scroll_top == false ? this.scroll_top = true : this.content.scrollToTop();
    });
  }

  modify_json(){
    for(var key in this.items) {
      this.items[key]['Rate'] = parseFloat(this.items[key]['Rate']).toFixed(2);
      this.items[key]['MRP_rate'] = parseFloat(this.items[key]['MRP_rate']).toFixed(2);
      this.items[key]['Image'] = this.items[key]['Image'] === null ? [] : this.items[key]['Image'].split(',');
    }
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

  page_redirect(page, category){
    this.navCtrl.push(page, {
      id: category
    });
  }

  active_sort(sort){
    for(var key in this.sorting_class) {
      this.sorting_class[key] = 'button button-md button-default button-default-md button-round button-round-md disable';
    }
    this.sorting_class[sort] = 'button button-md button-default button-default-md button-round button-round-md active';
    this.active_sorting = sort;
    this.get_item();
  }

  active_page(page_number){
    for(var page in this.pagination) {
      if(this.pagination[page]['class'].indexOf('active') >= 0){
        this.pagination[page]['class'].indexOf('show') ? this.pagination[page]['class'] = 'show' : this.pagination[page]['class'] = '';
      }
    }
    this.active_page_number = (page_number - 1);
    this.pagination[(page_number - 1)]['class'] = 'show active';
    this.get_item();
  }

  add_to_cart(item){
    event.stopPropagation();
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/add_to_cart';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      value: this.items[item]['ID']
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.items[item]['Button'] = 'Remove';
      this.cart_item += 1;
    });
  }

  remove_from_cart(item){
    event.stopPropagation();
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/remove_from_cart';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      value: this.items[item]['ID']
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.items[item]['Button'] = 'Add';
      this.cart_item -= 1;
    });
  }

  sharing(name, MRP, GST, image){
    event.stopPropagation();
    this.socialSharing.share('Name: '+name+' MRP: Rs. '+MRP+' GST: '+GST+'%', '', image);
  }

  open_detail(item){
    this.navCtrl.push('DetailPage', {
      id: item
    });
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
  }

  barcode_scanner(){
    this.barcodeScanner.scan({'showFlipCameraButton': true}).then(barcodeData => {
      //console.log('BarcodeData:', barcodeData);
      var link = 'https://www.vsss.co.in/Android/send_barcode';
      var post_data = JSON.stringify({Barcode: barcodeData});
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        if(data['ID'] == 0){
          alert('No item found please rescan barcode');
        }
        else{
          this.navCtrl.push('DetailPage', {
            id: data['ID']
          });
        }
      });
    }).catch(err => {
      console.log('Error', err);
    });
  }

}
