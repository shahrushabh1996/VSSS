import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Http } from '@angular/http';
import { HeaderColor } from '@ionic-native/header-color';
import { TranslateService } from '@ngx-translate/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HomePage } from '../home/home';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  device_data = {
  	IMEI: ''
  };

  cart_item: any = 0;

  item_id = '';

  item = '';

  item_name = '';

  item_gujarati_name = '';

  item_description = '';

  item_description_gujarati = '';

  item_remark = '';

  item_remark_gujarati = '';

  item_specification = '';

  item_specification_gujarati = '';

  categories = '';

  categories_gujarati = '';

  categories_id = '';

  sub_categories = '';

  sub_categories_gujarati = '';

  sub_categories_id = '';

  rate: any;

  mrp: any;

  unit = 'Select unit';

  Units = '';

  Units_gujarati = '';

  Units_id: any;

  Units_value: any;

  Base_unit_value = 1;

  qunatity: any;

  images: any;

  previews: any;

  videos: any;

  active_image: any;

  Loader: any = 1;

  slider: any = 0;

  active_image_index = 0;

  prev = false;

  next = false;

  language: string = '';

  ion_content: string = 'page_blue';

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public platform: Platform, public device: Device, public socialSharing: SocialSharing, public loadingCtrl: LoadingController, public headerColor: HeaderColor, public translate: TranslateService, public barcodeScanner: BarcodeScanner) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
    this.item_id = navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
      this.item_detail();
    });
  }

  item_detail(){
    var link = 'https://www.vsss.co.in/Android/item_detail';
    var post_data = JSON.stringify(
        {
          IMEI: this.device_data['IMEI'],
          id: this.item_id
        }
    );
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      this.item = data['Detail'];
      this.cart_item = data['Cart_items'];
      this.language = data['Language'];
      this.item_name = this.item[0]['English_name'].toLowerCase();
      this.item_gujarati_name = this.item[0]['Gujarati_name'].toLowerCase();
      this.rate = parseFloat(this.item[0]['Rate']).toFixed(2);
      this.mrp = parseFloat(this.item[0]['MRP_rate']).toFixed(2);
      //parseFloat and toFixed can't access in interface
      this.item[0]['Rate'] = parseFloat(this.item[0]['Rate']).toFixed(2);
      this.item[0]['MRP_rate'] = parseFloat(this.item[0]['MRP_rate']).toFixed(2);
      this.Units = this.item[0]['Units'] === null ? [] : this.item[0]['Units'].split(',');
      this.Units_gujarati = this.item[0]['Units_gujarati'] === null ? [] : this.item[0]['Units_gujarati'].split(',');
      this.Units_id = this.item[0]['Units_id'] === null ? [] : this.item[0]['Units_id'].split(',');
      this.Units_value = this.item[0]['Units_value'] === null ? [] : this.item[0]['Units_value'].split(',');
      this.unit = this.item[0]['Unit_select'];
      this.qunatity = this.item[0]['Quantity'] == 0 ? [] : parseInt(this.item[0]['Quantity']);
      this.item_specification = this.item[0]['Specification'].toLowerCase();
      this.item_specification_gujarati = this.item[0]['Gujarati_Specification'];
      this.item_description = this.item[0]['Description'].toLowerCase();
      this.item_description_gujarati = this.item[0]['Gujarati_Description'];
      this.item_remark = this.item[0]['Remark'].toLowerCase();
      this.item_remark_gujarati = this.item[0]['Gujarati_Remark'];
      this.categories = this.item[0]['Category'] === null ? [] : this.item[0]['Category'].split(',');
      this.categories_gujarati = this.item[0]['Category_gujarati'] === null ? [] : this.item[0]['Category_gujarati'].split(',');
      this.categories_id = this.item[0]['Category_id'] === null ? [] : this.item[0]['Category_id'].split(',');
      this.sub_categories = this.item[0]['Sub_category'] === null ? [] : this.item[0]['Sub_category'].split(',');
      this.sub_categories_gujarati = this.item[0]['Sub_category_gujarati'] === null ? [] : this.item[0]['Sub_category_gujarati'].split(',');
      this.sub_categories_id = this.item[0]['Sub_category_id'] === null ? [] : this.item[0]['Sub_category_id'].split(',');
      this.images = this.item[0]['Image'] === null ? [] : this.item[0]['Image'].split(',');
      this.previews = this.item[0]['Preview'] === null ? [] : this.item[0]['Preview'].split(',');
      this.videos = this.item[0]['Videos'] === null ? [] : this.item[0]['Videos'].split(',');
      this.active_image = this.images[0];
      if(this.images.length > 1){
        this.next = true;
      }
      this.Loader = 0;
      this.ion_content = 'page_gray';
      this.translate.use(this.language);
      this.change_price();
    });
  }

  open_category_sub_category(page, value){
  	this.navCtrl.push(page, {
      id: value
    });
  }

  sharing(name, MRP, GST, image){
    event.stopPropagation();
    this.socialSharing.share('Name: '+name+' MRP: Rs. '+MRP+' GST: '+GST+'%', '', image);
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
      value: this.item[0]['ID']
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.unit = this.item[0]['Base_unit'];
      this.qunatity = 1;
      this.item[0]['Button'] = 'Remove';
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
      value: this.item[0]['ID']
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      this.unit = 'Select unit';
      this.qunatity = '';
      this.item[0]['Button'] = 'Add';
      this.cart_item -= 1;
    });
  }

  qunatity_input(event: any) {
  	event.target.value = event.target.value.replace(/\./g, '');
  }

  cart(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/cart_submit';
    var post_data = JSON.stringify(
      {
        IMEI: this.device_data['IMEI'],
        qunatity: isNaN(this.qunatity) ? 0 : parseInt(this.qunatity),
        item_id: this.item_id,
        unit: parseInt(this.unit)
      }
    );
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      if(data['type'] == 'insert'){
        this.item[0]['Button'] = 'Remove';
        this.cart_item += 1;
      }
    })

  }

  change_price(){
    var selected_unit = this.unit;
    var array_index: number;
    this.Units_id.filter(function(element, index) {
        if(element == selected_unit){
          array_index = index;
        }
    });
    var Rate: any = parseFloat(this.item[0]['Rate']).toFixed(2);
    var MRP: any = parseFloat(this.item[0]['MRP_rate']).toFixed(2);
    var Unit_value: any = isNaN(this.Units_value[array_index]) ? 1 : parseFloat(this.Units_value[array_index]).toFixed(2);
    this.rate = Rate  * Unit_value;
    this.mrp = MRP  * Unit_value;
  }

  preview_change(index){
    this.active_image_index = index;
    this.next = true;
    this.prev = true;
    if(this.active_image_index == 0){
      this.prev = false;
    }
    if((this.images.length-1) == this.active_image_index){
      this.next = false;
    }
    this.active_image = this.images[index];
  }

  open_slider(){
    this.navCtrl.push('SliderPage',{
      images: this.images,
      active_slide_index: this.active_image_index
    });
  }

  prev_image(){
    this.active_image_index -= 1;
    this.next = true;
    if(this.active_image_index == 0){
      this.prev = false;
    }
    this.active_image = this.images[this.active_image_index];
  }

  next_image(){
    this.active_image_index += 1;
    this.prev = true;
    if((this.images.length-1) == this.active_image_index){
      this.next = false;
    }
    this.active_image = this.images[this.active_image_index];
  }

  page_redirect(page){
  	this.navCtrl.push(page);
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
