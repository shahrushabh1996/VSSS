import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailPage } from './detail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DetailPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(DetailPage),
  ],
})
export class DetailPageModule {}
