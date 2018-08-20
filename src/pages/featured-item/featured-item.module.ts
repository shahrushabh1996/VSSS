import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeaturedItemPage } from './featured-item';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FeaturedItemPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(FeaturedItemPage),
  ],
})
export class FeaturedItemPageModule {}
