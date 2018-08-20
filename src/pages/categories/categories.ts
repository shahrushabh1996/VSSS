import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import { DataProvider } from '../../providers/data/data';
import { HomePage } from '../home/home';
import { Device } from '@ionic-native/device';
import { ActionSheetController } from 'ionic-angular';
import { HeaderColor } from '@ionic-native/header-color';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { BackgroundMode } from '@ionic-native/background-mode';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import 'rxjs/add/operator/map';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova;

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  @ViewChild(Content) content: Content;

  device_data = {
    IMEI: ''
  };

  cart_item: any = 0;

  categories: any;

  search_categories: any;

  customer: any;

  Loader: any = 1;

  searchTerm: string = '';

  language: string = '';

  ion_content = 'page_blue';

  segment = 'Category';

  Edit_profile: string = '';

  Order_history: string = '';

  Order_item_history: string = '';

  Change_password: string = '';

  Logout: string = '';

  pdfObj = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public dataService: DataProvider, public device: Device, public platform: Platform, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public headerColor: HeaderColor, public translate: TranslateService, public transfer: FileTransfer, public file: File, public backgroundMode: BackgroundMode) {
    this.translate.setDefaultLang('english');
    this.headerColor.tint('#2874f0');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.device_data['IMEI'] = this.device.uuid === null ? '630fcc683424e59f' : this.device.uuid;
      var link = 'https://www.vsss.co.in/Android/get_category';
      var post_data = JSON.stringify({IMEI: this.device_data['IMEI']});
      this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
        console.log(data);
        this.cart_item = data['Cart_items'];
        this.categories = data['Categories'];
        this.search_categories = data['Categories'];
        this.language = data['Language'];
        this.customer = data['Customer'];
        this.translate.use(this.language);
        this.setFilteredCategory();
        this.Loader = 0;
        this.ion_content = '';
      });
    });
  }

	setFilteredCategory() {
    this.content.scrollToTop();
		this.search_categories = this.dataService.filterCategory(this.searchTerm, this.categories);
	}

	sub_catgeory(category){
    this.navCtrl.push('SubCategoriesPage', {
      id: category
    });
  }
  
  download(category){
    event.stopPropagation();
    var so = this;
    var loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait while we download images.'
    });
    loading.present();
    this.backgroundMode.enable();
    var link = 'https://www.vsss.co.in/Android/download_category_image';
    var post_data = JSON.stringify({Category: category});
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      var category = (data['Category'][0]['English_name'].replace(/ /g,"_")).toLowerCase();
      var items = data['Items'];
      so.file.createDir(so.file.externalDataDirectory, category, true).then(
        _ => {
          items.forEach(function(element){
            if(element['Preview'] !== null && element['Preview'] !== 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png'){
              let image_name = element['Preview'].substring(element['Preview'].lastIndexOf('/') + 1).split('.');
              let extension = image_name[1];
              let final_image_name = ((element['Item'].replace(/ /g,"_"))+'_'+(element['MRP'])+'_'+(element['GST'])).toLowerCase();
              let fileTransfer: FileTransferObject = so.transfer.create();
              fileTransfer.download(element['Preview'], so.file.externalDataDirectory+''+category+'/'+final_image_name+'.'+extension);
            }
          });
          this.backgroundMode.disable();
          loading.dismiss();
        }
      );
    });
  }

  /*PDF(category){
    event.stopPropagation();
    var so = this;
    var loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait while we generate PDF.'
    });
    loading.present();
    var link = 'https://www.vsss.co.in/Android/download_category_image';
    var post_data = JSON.stringify({Category: category});
    this.http.post(link, post_data).map(res => res.json()).subscribe(data => {
      var category = (data['Category'][0]['English_name'].replace(/ /g,"_")).toLowerCase();
      var items = data['Items'];
      var content = [];
      try{
        so.file.createDir(so.file.externalDataDirectory, category, true).then(
          _ => {
            let content = [];
            items.forEach(function(element, index){
              if(element['Preview'] !== null){
                let image = element['Preview'];
                let image_name = image.substring(image.lastIndexOf('/') + 1).split('.');
                let extension = image_name[1];
                let final_image_name = ((element['Item'].replace(/ /g,"_"))+'_'+(element['MRP'])+'_'+(element['GST'])).toLowerCase();
                let fileTransfer: FileTransferObject = so.transfer.create();
                fileTransfer.download(element['Preview'], so.file.externalDataDirectory+''+category+'/'+final_image_name+'.'+extension).then(
                  _ => {
                    so.generate_base64(so.file.externalDataDirectory+''+category, final_image_name+'.'+extension).then(
                      base64 => {
                        if((items.length - 1) == index){
                          content.push({ text: 'Item: ' + (element['Item']).toLowerCase() + ', MRP: ' + element['MRP'] + 'RS, GST ' + element['GST'] + '%', fontSize: 22, alignment: 'center', margin: 10 }, { image: base64, alignment: 'center' })
                          var docDefinition = { pageSize: 'A4', content: content }
                          so.pdfObj = pdfMake.createPdf(docDefinition);
                          so.pdfObj.getDataUrl((URL) => {
                            window.open(URL,'_system', 'location=yes');
                            loading.dismiss();
                            so.file.writeFile(so.file.externalDataDirectory + category, category + '.pdf', so.b64toBlob(URL.replace("data:application/pdf;base64,", ""), 'application/pdf'), {
                                replace: true
                            }).then(fileEntry => {
                                so.fileOpener.open(so.file.externalDataDirectory + category + '/' + category + '.pdf', 'application/pdf');
                            })
                          });
                        }
                        else{
                          content.push({ text: 'Item: ' + (element['Item']).toLowerCase() + ', MRP: ' + element['MRP'] + 'RS, GST ' + element['GST'] + '%', fontSize: 22, alignment: 'center', margin: 10 }, { image: base64, alignment: 'center', pageBreak: 'after' })
                        }
                      }
                    );
                  }
                );
              }
            });
          }
        )
      }
      catch(err){
        alert('PDF Generate failed');
        loading.dismiss();
      }
    });
  }*/

  generate_base64(filePath, fileName){
    var so = this;
    return new Promise((resolve, reject) => {
      so.file.readAsDataURL(filePath, fileName).then(result => {
        resolve(result)
      });
    });
  }

  /*b64toBlob(b64Data, contentType) {
    var binary_string =  window.atob(b64Data);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }*/

  page_redirect(page){
    this.navCtrl.push(page);
  }

  root_page(){
    this.navCtrl.push(HomePage);
  }

  user_tab(){
    this.translate.get(['Edit_profile', 'Order_history', 'Order_item_history', 'Change_password', 'Logout']).subscribe(res => {
      this.Edit_profile = res.Edit_profile;
      this.Order_history = res.Order_history;
      this.Order_item_history = res.Order_item_history;
      this.Change_password = res.Change_password;
      this.Logout = res.Logout;
    });
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

}
