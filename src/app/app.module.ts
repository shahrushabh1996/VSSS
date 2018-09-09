import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { HeaderColor } from '@ionic-native/header-color';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SelectSearchableModule } from 'ionic-select-searchable';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DataProvider } from '../providers/data/data';
import { AutoSuggestProvider } from '../providers/auto-suggest/auto-suggest';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [ 
    FormsModule, 
    BrowserModule,
    HttpModule,
    SelectSearchableModule,
    //AutoCompleteModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    SocialSharing,
    DataProvider,
    HttpClientModule,
    PhotoViewer,
    HeaderColor,
    IonicErrorHandler,
    DataProvider,
    AutoSuggestProvider,
    BarcodeScanner,
    File,
    FileTransfer,
    BackgroundMode
  ]
})
export class AppModule {}
