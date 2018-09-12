import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, Content } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Device } from '@ionic-native/device';
import { Http } from '@angular/http';
import { DataProvider } from '../../providers/data/data';
import { HeaderColor } from '@ionic-native/header-color';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/timeout';

/**
 * Generated class for the WishlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wishlist',
  templateUrl: 'wishlist.html',
})
export class WishlistPage {

  @ViewChild(Content) content: Content;

  device_data = {
    IMEI: ''
  };

  sorting_class = {
    Default: 'button button-md button-default button-default-md button-round button-round-md active',
    Name_asc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Name_desc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Price_asc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Price_desc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Date_desc: 'button button-md button-default button-default-md button-round button-round-md disable',
    Date_asc: 'button button-md button-default button-default-md button-round button-round-md disable'
  };

  active_sorting = 'Default';

  items: any;

  language: string = '';

  searchTerm: string = '';

  sub_total: any = 0;

  discount: any = 0;

  GST: any = 0;

  shipping: any = 0;

	total: any = 0;

  Parcel = true;

  Select_units = [];

  Quantity_input = [];

  cart_item: any = 0;

  wishlist_item: any = 0;

  User_data: any = '';

  Loader: any = 1;

  ion_content: any = 'page_blue';

  constructor(public navCtrl: NavController, public navParams: NavParams, public device: Device, public http: Http, public platform: Platform, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public dataService: DataProvider, public headerColor: HeaderColor, public translate: TranslateService) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WishlistPage');
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
    var link = 'https://www.vsss.co.in/Android/get_wishlist_item';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      order: this.active_sorting,
      Platform: this.device.platform === null ? 'Browser' : this.device.platform
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.items = data['Items'];
      this.language = data['Language'];
      this.Parcel = data['Parcel'] == 'True' ? true : false;
      this.cart_item = data['Cart_items'];
      this.wishlist_item = this.items.length;
      this.translate.use(this.language);
      this.modify_json();
    });
  }

  modify_json(){
    for(let key in this.items) {
      this.items[key]['Rate'] = parseFloat(this.items[key]['Rate']).toFixed(2);
      this.items[key]['Amount'] = parseFloat(this.items[key]['Amount']).toFixed(2);
      this.items[key]['MRP_rate'] = parseFloat(this.items[key]['MRP_rate']).toFixed(2);
      this.items[key]['Units'] = this.items[key]['Units'] === null ? [] : this.items[key]['Units'].split(',');
      this.items[key]['Units_gujarati'] = this.items[key]['Units_gujarati'] === null ? [] : this.items[key]['Units_gujarati'].split(',');
      this.items[key]['Units_id'] = this.items[key]['Units_id'] === null ? [] : this.items[key]['Units_id'].split(',');
      this.items[key]['Units_value'] = this.items[key]['Units_value'] === null ? [] : this.items[key]['Units_value'].split(',');
      this.items[key]['Image'] = this.items[key]['Image'] === null ? [] : this.items[key]['Image'].split(',');
      this.Select_units[key] = this.items[key]['select_unit'];
      this.Quantity_input[key] = this.items[key]['Quantity'];
      this.change_price(key);
    }
  }

  change_price(index){
    var Units_id = this.items[index]['Units_id'];
    var Selected_unit = this.Select_units[index];
    var unit_value_index = 0;
    var i = 0;
    Units_id.forEach(function (value) {
      if(Selected_unit == Units_id[i]){
        unit_value_index = i;
      }
      i++;
    });
    this.items[index]['Rate'] = this.items[index]['Units_value'][unit_value_index] * this.items[index]['Base_rate'];
    this.items[index]['Rate'] = parseFloat(this.items[index]['Rate']).toFixed(2);
    var Rate = Number(this.items[index]['Rate']);
    var GST = Number((this.items[index]['Rate'] * this.items[index]['IGST']) / 100);
    var Discount = Number(((Rate + GST) * this.items[index]['Discount']) / 100)
    var Quantity = Number(this.Quantity_input[index]);
    this.items[index]['Amount'] = (((Rate + GST) - Discount) * Quantity).toFixed(2);
    this.calculation();
  }

  calculation(){
    this.sub_total = 0;
    this.discount = 0;
    this.GST = 0;
    this.shipping = 0;
    for(let key in this.items){
      if(typeof this.Quantity_input[key] != 'undefined'){
        let rate: any = parseFloat(this.items[key]['Rate']).toString(); //this.items[key]['Rate']
        let quantity: any = isNaN(this.Quantity_input[key]) || this.Quantity_input[key] == '' ? 1 : parseInt(this.Quantity_input[key]).toString(); // this.Quantity_input[key]
        let discount: any = parseFloat(this.items[key]['Discount']).toString();
        let GST: any = parseFloat(this.items[key]['IGST']).toString();
        let amount_GST = Number((rate * GST) / 100);
        let amount_discount = Number(((Number(rate) + amount_GST) * Number(discount)) / 100);
        this.items[key]['Amount'] = (((Number(rate) + amount_GST) - amount_discount) * Number(quantity)).toFixed(2);
        let sub_total_amount: any = (parseFloat(rate) * parseFloat(quantity));
        let discount_amount: any = ((parseFloat(sub_total_amount) * parseFloat(discount)) / 100);
        let GST_amount: any = (((parseFloat(sub_total_amount) - parseFloat(discount_amount)) * parseFloat(GST))/ 100); // parseFloat(((sub_total_amount - discount_amount) * GST) / 100);
        this.sub_total = parseFloat(sub_total_amount + this.sub_total);
        this.discount = parseFloat(discount_amount + this.discount);
        this.GST = parseFloat(GST_amount + this.GST);
      }
    }
    if(this.Parcel == true){
      let shipping_rate: any = Math.ceil((((parseFloat(this.sub_total) - parseFloat(this.discount)) + parseFloat(this.GST)) / 5000));
      this.shipping = (parseFloat(shipping_rate) *  100  /*Parcel rate*/); //parseFloat(Math.ceil(parseFloat(this.sub_total-this.discount+this.GST)/5000)*60);
      this.GST = parseFloat(((this.shipping * 18) / 100) + this.GST);
    }
    this.total = parseFloat((this.sub_total - this.discount) + this.GST + this.shipping);
    this.sub_total = parseFloat(this.sub_total).toFixed(2);
    this.discount = parseFloat(this.discount).toFixed(2);
    this.GST = parseFloat(this.GST).toFixed(2);
    this.shipping = parseFloat(this.shipping).toFixed(2);
    this.total = parseFloat(this.total).toFixed(2);
  }

  update_wishlist(index){
    var selected_unit = this.Select_units[index];
    var units_id = this.items[index]['Units_id'];
    var unit_index = 0;
    units_id.find(function(item, i){if(item === selected_unit){unit_index = i};})
    this.items[index]['select_unit_name'] = this.items[index]['Units'][unit_index];
    this.items[index]['select_unit_name_gujarati'] = this.items[index]['Units_gujarati'][unit_index];
    this.items[index]['Quantity'] = isNaN(this.Quantity_input[index]) || this.Quantity_input[index] == '' ? 1 : parseInt(this.Quantity_input[index]);
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/wishlist_submit';
    var post_data = JSON.stringify(
      {
        IMEI: this.device_data['IMEI'],
        qunatity: isNaN(this.Quantity_input[index]) || this.Quantity_input[index] == '' ? 0 : parseInt(this.Quantity_input[index]),
        item_id: this.items[index]['ID'],
        unit: parseInt(this.Select_units[index]),
        Platform: this.device.platform === null ? 'Browser' : this.device.platform
      }
    );
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
    })
  }

  remove_from_wishlist(index){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/remove_from_wishlist';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      value: this.items[index]['ID'],
      Platform: this.device.platform === null ? 'Browser' : this.device.platform
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      delete this.items[index];
      delete this.Select_units[index];
      delete this.Quantity_input[index];
      this.items = this.remove_undefined(this.items);
      this.Select_units = this.remove_undefined(this.Select_units);
      this.Quantity_input = this.remove_undefined(this.Quantity_input);
      this.wishlist_item = this.items.length;
      this.calculation();
    });
  }

  move_to_cart(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var items = [];
    for(let key in this.items){
      items[key] = {
        'Item':this.items[key]['ID'],
        'Quantity':this.Quantity_input[key],
        'Unit':this.Select_units[key]
      }
    }
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      Platform: this.device.platform === null ? 'Browser' : this.device.platform,
      Item: JSON.stringify(items),
    });
    var link = 'https://www.vsss.co.in/Android/move_to_cart';
    this.http.post(link, post_data).timeout(300000).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.page_redirect('CheckoutPage');
    });
  }

  move_to_cart_item(index){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/wishlist_update_move';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      Item: this.items[index]['ID'],
      Quantity: this.Quantity_input[index],
      Unit: this.Select_units[index],
      Platform: this.device.platform === null ? 'Browser' : this.device.platform
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      if(data['response'] == 1){
        alert('Item moved to cart');
        delete this.items[index];
        delete this.Select_units[index];
        delete this.Quantity_input[index];
        this.items = this.remove_undefined(this.items);
        this.Select_units = this.remove_undefined(this.Select_units);
        this.Quantity_input = this.remove_undefined(this.Quantity_input);
        this.wishlist_item = this.items.length;
        this.calculation();
      }
      else{
        alert('Sorry item alredy in cart');
      }
    });
  }

  active_sort(sort){
    for(let key in this.sorting_class) {
      this.sorting_class[key] = 'button button-md button-default button-default-md button-round button-round-md disable';
    }
    this.sorting_class[sort] = 'button button-md button-default button-default-md button-round button-round-md active';
    this.active_sorting = sort;
    this.get_item();
  }

  page_redirect(page){
  	this.navCtrl.push(page);
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

  remove_undefined(array){
    var new_array = [];
    for(let element in array){
      if(typeof array[element] != 'undefined'){
        new_array.push(array[element]);
      }
    }
    return new_array;
  }

  setFilteredCartItem(){
    this.content.scrollToTop();
    this.items = this.dataService.filterCartItems(this.searchTerm, this.items);
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
  }

}
