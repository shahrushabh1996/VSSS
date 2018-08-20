import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderPage } from './order';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OrderPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(OrderPage),
  ],
})
export class OrderPageModule {}
