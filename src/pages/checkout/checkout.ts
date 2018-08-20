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
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  @ViewChild(Content) content: Content;

  device_data = {
    IMEI: ''
  };

  cart_item: any = 0;

  items: any;

  search_items: any;

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

  Parcel = true;

  Select_units = [];

  Quantity_input = [];

  GST_option = [];

  All_item: boolean = true;

  searchTerm: string = '';

  sub_total: any = 0;

  discount: any = 0;

  GST: any = 0;

  shipping: any = 0;

  total_item: any = 0;

  total: any = 0;

  User_data: any = '';

  GST_Number: any = '';

  Transport: any = '';

  Transport_Number: any = '';

  Address: any = '';

  Shipping_address: any = '';

  Remark: any = '';

  Loader: any = 1

  segment: any = 'Item';

  View: any = 'Item';

  language: string = '';

  ion_content: any = 'page_blue';

  constructor(public navCtrl: NavController, public navParams: NavParams, public device: Device, public http: Http, public platform: Platform, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public dataService: DataProvider, public headerColor: HeaderColor, public translate: TranslateService) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
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
    var link = 'https://www.vsss.co.in/Android/get_cart_item';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      order: this.active_sorting,
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.items = data['Items'];
      this.language = data['Language'];
      this.Parcel = data['Parcel'] == 'True' ? true : false;
      this.User_data = data['User_data'][0];
      this.GST_Number = data['User_data'][0]['GST'];
      this.Transport = data['User_data'][0]['transport_name'];
      this.Transport_Number = data['User_data'][0]['transport_mobile']; 
      this.Shipping_address = data['User_data'][0]['shipping_address_1'].trim();
      this.Address = 'Ofiice';
      this.total_item = this.items.length;
      this.cart_item = this.items.length;
      this.GST_option[this.total_item] = true;
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
      this.items[key]['IGST'] = this.items[key]['GST_type'] == 'True' ? this.items[key]['IGST'] : 0;
      this.Select_units[key] = this.items[key]['select_unit'];
      this.Quantity_input[key] = this.items[key]['Quantity'];
      this.GST_option[key] = this.items[key]['GST_type'] == 'True' ? true : false;
      this.change_price(key);
    }
    this.GST_option[this.total_item] = true;
  }

  active_sort(sort){
    for(let key in this.sorting_class) {
      this.sorting_class[key] = 'button button-md button-default button-default-md button-round button-round-md disable';
    }
    this.sorting_class[sort] = 'button button-md button-default button-default-md button-round button-round-md active';
    this.active_sorting = sort;
    this.get_item();
  }

  remove_from_cart(index){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/remove_from_cart';
    var post_data = JSON.stringify({
      IMEI: this.device_data['IMEI'],
      value: this.items[index]['ID']
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.cart_item -= 1;
      delete this.items[index];
      delete this.Select_units[index];
      delete this.Quantity_input[index];
      this.items = this.remove_undefined(this.items);
      this.Select_units = this.remove_undefined(this.Select_units);
      this.Quantity_input = this.remove_undefined(this.Quantity_input);
      this.calculation();
    });
  }

  update_cart(index){
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
    var link = 'https://www.vsss.co.in/Android/cart_submit';
    var post_data = JSON.stringify(
      {
        IMEI: this.device_data['IMEI'],
        qunatity: isNaN(this.Quantity_input[index]) || this.Quantity_input[index] == '' ? 0 : parseInt(this.Quantity_input[index]),
        item_id: this.items[index]['ID'],
        unit: parseInt(this.Select_units[index])
      }
    );
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
    })
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
        let GST_amount: any = this.items[key]['GST_type'] == false ? 0 : (((parseFloat(sub_total_amount) - parseFloat(discount_amount)) * parseFloat(GST))/ 100); // parseFloat(((sub_total_amount - discount_amount) * GST) / 100);
        this.sub_total = parseFloat(sub_total_amount + this.sub_total);
        this.discount = parseFloat(discount_amount + this.discount);
        this.GST = this.items[key]['GST_type'] == false ? this.GST : parseFloat(GST_amount + this.GST);
      }
    }
    if(this.Parcel == true){
      let shipping_rate: any = Math.ceil(((parseFloat(this.sub_total) - parseFloat(this.discount) + parseFloat(this.GST)) / 5000));
      this.shipping = (parseFloat(shipping_rate) *  100  /*Parcel rate*/); //parseFloat(Math.ceil(parseFloat(this.sub_total-this.discount+this.GST)/5000)*60);
      if(this.GST_option[this.total_item] == true){
        this.GST = parseFloat(((this.shipping * 18) / 100) + this.GST);
      }
    }
    this.total = parseFloat((this.sub_total - this.discount) + this.GST + this.shipping);
    this.sub_total = parseFloat(this.sub_total).toFixed(2);
    this.discount = parseFloat(this.discount).toFixed(2);
    this.GST = parseFloat(this.GST).toFixed(2);
    this.shipping = parseFloat(this.shipping).toFixed(2);
    this.total = parseFloat(this.total).toFixed(2);
  }

  setFilteredCartItem(){
    this.content.scrollToTop();
    this.items = this.dataService.filterCartItems(this.searchTerm, this.items);
  }

  change_segment(value){
    this.View = value;
  }

  GST_update(index){
    if(this.GST_option.length > 0){
      !!this.GST_option.reduce(function(a, b){ return (a === b) ? a : NaN; }) ? this.All_item = true : this.All_item = false;
    }
    if(index == this.total_item){
      this.calculation();
    }
    else{
      var GST_types = '';
      if(this.GST_option[index] == false){
        GST_types = 'False';
        this.items[index]['IGST'] = 0;
      }
      else{
        GST_types = 'True';
        this.items[index]['IGST'] = this.items[index]['Base_gst'];
      }
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Please wait.'
      });
      loading.present();
      var link = 'https://www.vsss.co.in/Android/cart_gst_update';
      var post_data = JSON.stringify(
        {
          IMEI: this.device_data['IMEI'],
          GST_type: GST_types,
          item_id: this.items[index]['ID']
        }
      );
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        loading.dismiss();
        this.calculation();
      })
    }
  }

  check_all(){
    this.All_item == true ? this.GST_option.map(function(x, i, GST_option){ GST_option[i] = true; }) : this.GST_option.map(function(x, i, GST_option){ GST_option[i] = false; });
  }

  place_order(){
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
        'Unit':this.Select_units[key],
        'GST':this.GST_option[key],
      }
    }
    var post_data = JSON.stringify(
      {
        IMEI: this.device_data['IMEI'],
        Item: JSON.stringify(items),
        GST_number:this.GST_Number,
        Transport_name:this.Transport,
        Transport_mobile:this.Transport_Number,
        Shipping_address:this.Address,
        Remark:this.Remark,
        Sub_total: this.sub_total,
        GST: this.GST,
        Discount: this.discount,
        Shipping: this.shipping,
        Total: this.total,
      }
    );
    var link = 'https://www.vsss.co.in/Android/order_item';
    this.http.post(link, post_data).timeout(300000).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.page_redirect('OrderPage');
    });
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
  }

}
