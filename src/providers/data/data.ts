import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DataProvider Provider');
  }

  filterCategory(searchTerm, categories){
  	return categories.filter((category) => {
        return category.English_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });   
  }

  filterSubCategory(searchTerm, sub_categories){
    return sub_categories.filter((sub_category) => {
        return sub_category.English_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  filterCartItems(searchTerm, Cart_items){
    return Cart_items.filter((Cart_item, index) => {
        if(Cart_item.English_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1){
          Cart_item['View'] = 'True';
        }
        else{
          Cart_item['View'] = 'False';
        }
        return Cart_item;
    });
  }

  filterOrderItems(searchTerm, Order_items){
    return Order_items.filter((Order_item, index) => {
        if(Order_item.Item_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1){
          Order_item['View'] = 'True';
        }
        else{
          Order_item['View'] = 'False';
        }
        return Order_item;
    });
  }

}
