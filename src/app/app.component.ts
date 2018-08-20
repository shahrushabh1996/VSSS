import { Component, ViewChild } from '@angular/core';
import { Config, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { FeaturedItemPage } from '../pages/featured-item/featured-item';
import { CategoriesPage } from '../pages/categories/categories';
import { CategoryItemPage } from '../pages/category-item/category-item';
import { SubCategoriesPage } from '../pages/sub-categories/sub-categories';
import { SubCategoryItemPage } from '../pages/sub-category-item/sub-category-item';
import { CheckoutPage } from '../pages/checkout/checkout';
import { OrderPage } from '../pages/order/order';
import { OrderitemPage } from '../pages/orderitem/orderitem';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { LoginPage } from '../pages/login/login';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { SignupPage } from '../pages/signup/signup';
import { ActivationPage } from '../pages/activation/activation';
import { SliderPage } from '../pages/slider/slider';
import { SearchPage } from '../pages/search/search';
import { SearchItemPage } from '../pages/search-item/search-item';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString('#2874f0');
      splashScreen.hide();
    });
  }

}

