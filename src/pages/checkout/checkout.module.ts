import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutPage } from './checkout';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CheckoutPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(CheckoutPage),
  ],
})
export class CheckoutPageModule {}
