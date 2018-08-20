import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';
import { TranslateModule } from '@ngx-translate/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { BackgroundMode } from '@ionic-native/background-mode';

@NgModule({
  declarations: [
    CategoriesPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(CategoriesPage),
  ],
})
export class CategoriesPageModule {}
