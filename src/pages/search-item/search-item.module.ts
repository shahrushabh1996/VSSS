import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchItemPage } from './search-item';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SearchItemPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(SearchItemPage),
  ],
})
export class SearchItemPageModule {}
