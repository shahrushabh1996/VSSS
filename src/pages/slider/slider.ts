import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { HeaderColor } from '@ionic-native/header-color';
import { HomePage } from '../home/home';

/**
 * Generated class for the SliderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {

  images: any;

  active_slide_index: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public photoViewer: PhotoViewer, public headerColor: HeaderColor) {
    this.headerColor.tint('#2874f0');
    this.images = navParams.get('images');
    this.active_slide_index = navParams.get('active_slide_index');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SliderPage');
  }

  zoomImage(image) {
    this.photoViewer.show(image);
  }

  root_page(){
    this.navCtrl.setRoot(HomePage);
  }

}
