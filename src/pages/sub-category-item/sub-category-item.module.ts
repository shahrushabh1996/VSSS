import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubCategoryItemPage } from './sub-category-item';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SubCategoryItemPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(SubCategoryItemPage),
  ],
})
export class SubCategoryItemPageModule {}
