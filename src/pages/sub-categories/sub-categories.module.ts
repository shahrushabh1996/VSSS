import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubCategoriesPage } from './sub-categories';
import { TranslateModule } from '@ngx-translate/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { BackgroundMode } from '@ionic-native/background-mode';

@NgModule({
  declarations: [
    SubCategoriesPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(SubCategoriesPage),
  ],
})
export class SubCategoriesPageModule {}
