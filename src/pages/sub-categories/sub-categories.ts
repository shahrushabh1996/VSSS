import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Device } from '@ionic-native/device'
import { DataProvider } from '../../providers/data/data';
import { HeaderColor } from '@ionic-native/header-color';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { BackgroundMode } from '@ionic-native/background-mode';

/**
 * Generated class for the SubCategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sub-categories',
  templateUrl: 'sub-categories.html',
})
export class SubCategoriesPage {

  @ViewChild(Content) content: Content;

  device_data = {
    IMEI: ''
  };

  cart_item: any = 0;

  category = '';

  sub_categories: any;

  search_sub_categories: any;

  Loader: any = 1;

  segment = 'Sub_categories';

  CategoryName: string;

  CategoryNameGujarati: string;

  searchTerm: string = '';

  language: string = '';

  ion_content: string = 'page_blue';

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public dataService: DataProvider, public headerColor: HeaderColor, public device: Device, public platform: Platform, public loadingCtrl: LoadingController, public translate: TranslateService, public transfer: FileTransfer, public file: File, public backgroundMode: BackgroundMode) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
    this.category = navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubCategoriesPage');
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
      this.get_sub_category();
      this.Loader = 0;
      this.ion_content = '';
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
        this.sub_categories = data['Sub_categories'];
        this.search_sub_categories = data['Sub_categories'];
        this.cart_item = data['Cart_items'];
        this.language = data['Language'];
        this.Loader = 0;
        this.ion_content = '';
        this.translate.use(this.language);
    });
  }

  download(sub_category){
    event.stopPropagation();
    var so = this;
    var loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait while we download images.'
    });
    loading.present();
    this.backgroundMode.enable();
    var link = 'https://www.vsss.co.in/Android/download_sub_category_image';
    var post_data = JSON.stringify({Sub_category: sub_category});
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      var sub_category = (data['Sub_category'][0]['English_name'].replace(/ /g,"_")).toLowerCase();
      var items = data['Items'];
      so.file.createDir(so.file.externalDataDirectory, sub_category, true).then(
        _ => {
          items.forEach(function(element){
            if(element['Image'] !== null){
              let image_name = element['Image'].substring(element['Image'].lastIndexOf('/') + 1).split('.');
              let extension = image_name[1];
              let final_image_name = ((element['Item'].replace(/ /g,"_"))+'_'+(element['MRP'])+'_'+(element['GST'])).toLowerCase();
              let fileTransfer: FileTransferObject = so.transfer.create();
              fileTransfer.download(element['Image'], so.file.externalDataDirectory+''+sub_category+'/'+final_image_name+'.'+extension);
            }
          });
          this.backgroundMode.disable();
          loading.dismiss();
        }
      );
    });
  }

  setFilteredSubCategory(){
    this.content.scrollToTop();
  	this.search_sub_categories = this.dataService.filterSubCategory(this.searchTerm, this.sub_categories);
  }

  page_redirect(page, ID){
    this.navCtrl.push(page, {
      id: ID
    });
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
  }

}
