import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    SignupPage
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
    SelectSearchableModule
  ],
})
export class SignupPageModule {}
