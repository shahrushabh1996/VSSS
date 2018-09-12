import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WishlistPage } from './wishlist';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WishlistPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(WishlistPage),
  ],
})
export class WishlistPageModule {}
