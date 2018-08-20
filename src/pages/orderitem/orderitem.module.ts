import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderitemPage } from './orderitem';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OrderitemPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(OrderitemPage),
  ],
})
export class OrderitemPageModule {}
