import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryItemPage } from './category-item';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CategoryItemPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(CategoryItemPage),
  ],
})
export class CategoryItemPageModule {}
