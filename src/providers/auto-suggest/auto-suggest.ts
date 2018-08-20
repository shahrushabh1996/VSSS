import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

/*
  Generated class for the AutoSuggestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AutoSuggestProvider implements AutoCompleteService {

  labelAttribute = "name";

  constructor(public http: HttpClient, public Http: Http) {
    console.log('Hello AutoSuggestProvider Provider');
  }
  getResults(keyword:string) {
    return this.Http.get("https://restcountries.eu/rest/v1/name/"+keyword).map(res=>{ return res.json() }).map(result=>{ return result.filter(res=>{ return res.name.toLowerCase().startsWith(keyword.toLowerCase()) }) })
    //return this.Http.get("https://restcountries.eu/rest/v1/name/"+keyword).map( result => { return result.filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) ) });
  }

}
