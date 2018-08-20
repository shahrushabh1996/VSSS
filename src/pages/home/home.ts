import { Component, ViewChild  } from '@angular/core';
import { NavController, Platform, LoadingController, Content } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Device } from '@ionic-native/device';
import { Http } from '@angular/http';
import { ActionSheetController } from 'ionic-angular';
import { HeaderColor } from '@ionic-native/header-color';
import { TranslateService } from '@ngx-translate/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Content) content: Content;

  json_data: any;

  device_data = {
  	IMEI: ''
  };

  cart_item: any = 0;

  pagination: any;

  items: any;

  customer: any;

  Loader: any = 1;

  segment: any = 'Home';

  ion_content: any = 'page_blue';

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

  scroll_top = true;

  active_page_number = 0;

  language: string = '';

  Edit_profile: string = '';

  Order_history: string = '';

  Order_item_history: string = '';

  Change_password: string = '';

  Logout: string = '';

  prev_page: string = 'hide';

  next_page: string = 'hide';

  active_slot = 0;

  constructor(public navCtrl: NavController, public device: Device, public http: Http, public platform: Platform, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public actionSheetCtrl: ActionSheetController, public headerColor: HeaderColor, public translate: TranslateService, public barcodeScanner: BarcodeScanner) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
    translate.get(['Edit_profile', 'Order_history', 'Order_item_history', 'Change_password', 'Logout']).subscribe(res => {
      this.Edit_profile = res.Edit_profile;
      this.Order_history = res.Order_history;
      this.Order_item_history = res.Order_item_history;
      this.Change_password = res.Change_password;
      this.Logout = res.Logout;
    });
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
      this.scroll_top = false;
      this.get_data();
  	});
  }

  get_data(){
  	var link = 'https://www.vsss.co.in/Android/check_login';
    var post_data = JSON.stringify({IMEI: this.device_data['IMEI']});
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        if(data == 0){
          this.navCtrl.push('LoginPage');
        }
        else{
          this.ion_content = '';
          this.Loader = 0;
          this.get_item();
        }
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
      type: 'Featured',
      value: '',
      order: this.active_sorting,
      page: this.active_page_number
    });
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      console.log(data);
      this.items = data['Items'];
      this.cart_item = data['cart_item'];
      this.customer = data['Customer'];
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

  page_redirect(page){
  	this.navCtrl.push(page);
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
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
    /*var data = ["https://images.wallpaperscraft.com/image/parrot_yellow_bird_122013_300x168.jpg","https://images.wallpaperscraft.com/image/man_shadow_silhouette_122012_300x168.jpg","https://images.wallpaperscraft.com/image/meditation_calmness_harmony_122011_300x168.jpg","https://images.wallpaperscraft.com/image/leaf_fallen_heart_122010_300x168.jpg","https://images.wallpaperscraft.com/image/northern_lights_sky_stars_122009_300x168.jpg","https://images.wallpaperscraft.com/image/headphones_minimalism_pastel_122007_300x168.jpg","https://images.wallpaperscraft.com/image/blackberries_raspberries_strawberries_122006_300x168.jpg","https://images.wallpaperscraft.com/image/roses_colorful_bouquet_122005_300x168.jpg","https://images.wallpaperscraft.com/image/thunderstorm_clouds_ocean_122003_300x168.jpg","https://images.wallpaperscraft.com/image/starry_sky_milky_way_man_122001_300x168.jpg","https://images.wallpaperscraft.com/image/palm_trees_sunset_hawaii_121999_300x168.jpg","https://images.wallpaperscraft.com/image/path_magic_art_121998_300x168.jpg","https://images.wallpaperscraft.com/image/halloween_mask_scary_121994_300x168.jpg","https://images.wallpaperscraft.com/image/neon_inscription_pizza_121993_300x168.jpg","https://images.wallpaperscraft.com/image/winter_trees_spruce_121992_300x168.jpg","https://images.wallpaperscraft.com/image/begonia_flowers_red_121991_300x168.jpg","https://images.wallpaperscraft.com/image/man_mask_scheme_121990_300x168.jpg","https://images.wallpaperscraft.com/image/surface_yellow_squares_121988_300x168.jpg","https://images.wallpaperscraft.com/image/surface_yellow_squares_121988_300x168.jpg","https://images.wallpaperscraft.com/image/ship_tree_art_121987_300x168.jpg"];
    var so = this;
    this.file.createDir(this.file.externalDataDirectory, 'rushabh1', true).then(
      _ => {
        data.forEach(function(element){
          var image_name = element.replace("https://images.wallpaperscraft.com/image/", "");
          var fileTransfer: FileTransferObject = so.transfer.create();
          fileTransfer.download(element, so.file.externalDataDirectory+'rushabh1/'+image_name);
        });
        alert('Download complete');
      }
    )*/
    this.socialSharing.share('Name: '+name+' MRP: Rs. '+MRP+' GST: '+GST+'%', '', image);
  }

  open_detail(item){
    this.navCtrl.push('DetailPage', {
      id: item
    });
  }

  user_tab(){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'English',
          handler: () => {
            let loading = this.loadingCtrl.create({
              spinner: 'crescent',
              content: 'Please wait.'
            });
            loading.present();
            this.platform.ready().then(() => {
              this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
              var link = 'https://www.vsss.co.in/Android/change_language';
              var post_data = JSON.stringify({
                IMEI: this.device_data['IMEI'],
                Language: 'English'
              });
              this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
                loading.dismiss();
                this.navCtrl.push(this.navCtrl.getActive().component);
              });
            });
          }
        },{
          text: 'ગુજરાતી',
          handler: () => {
            let loading = this.loadingCtrl.create({
              spinner: 'crescent',
              content: 'Please wait.'
            });
            loading.present();
            this.platform.ready().then(() => {
              this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
              var link = 'https://www.vsss.co.in/Android/change_language';
              var post_data = JSON.stringify({
                IMEI: this.device_data['IMEI'],
                Language: 'Gujarati'
              });
              this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
                loading.dismiss();
                this.navCtrl.push(this.navCtrl.getActive().component);
              });
            });
          }
        },{
          text: this.Edit_profile,
          handler: () => {
            this.navCtrl.push('ProfilePage');
          }
        },{
          text: this.Order_history,
          handler: () => {
            this.navCtrl.push('OrderPage');
          }
        },{
          text: this.Order_item_history,
          handler: () => {
            this.navCtrl.push('OrderitemPage');
          }
        }
      ]
    });
    if(this.customer != ''){
      actionSheet.addButton({ text: 'Ledger', handler: () => { window.open('https://www.vsss.co.in/Admin/index.php/Ledger/customer_print/'+this.customer, '_system', 'location=yes'); } });
      actionSheet.addButton({ text: 'Outstanding', handler: () => { window.open('https://www.vsss.co.in/Admin/index.php/Outstanding/customer_print/'+this.customer, '_system', 'location=yes'); } });
      actionSheet.addButton({ text: this.Change_password, handler: () => { this.navCtrl.push('ChangepasswordPage'); } });
      actionSheet.addButton({ text: this.Logout, handler: () => { let loading = this.loadingCtrl.create({ spinner: 'crescent', content: 'Please wait.' }); loading.present(); var link = 'https://www.vsss.co.in/Android/logout'; var post_data = JSON.stringify({IMEI: this.device_data['IMEI']}); this.http.post(link, post_data).map(res => res.json()).subscribe(data => { loading.dismiss(); this.navCtrl.setRoot(HomePage); }); } });
    }
    else{
      actionSheet.addButton({ text: this.Change_password, handler: () => { this.navCtrl.push('ChangepasswordPage'); } });
      actionSheet.addButton({ text: this.Logout, handler: () => { let loading = this.loadingCtrl.create({ spinner: 'crescent', content: 'Please wait.' }); loading.present(); var link = 'https://www.vsss.co.in/Android/logout'; var post_data = JSON.stringify({IMEI: this.device_data['IMEI']}); this.http.post(link, post_data).map(res => res.json()).subscribe(data => { loading.dismiss(); this.navCtrl.setRoot(HomePage); }); } });
    }
    actionSheet.present();
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
