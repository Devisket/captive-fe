import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../_models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  getAllProducts(bankInfoId: string): Observable<any> {
    return this.http.get(this.queryUrl + bankInfoId + "/Product");
  }

  addProductType(bankInfoId: string, productName: string) {
    return this.http.post(this.commandUrl + `bank/${bankInfoId}/product`, { productName });
  }

  updateProductType(productType: any, bankInfoId: string, productId: string) {
    return this.http.put(this.commandUrl + `bank/${bankInfoId}/product/${productId}`, productType);
  }

  deleteProductType(bankInfoId: string, productId: string) {
    return this.http.delete(this.commandUrl + `bank/${bankInfoId}/product/${productId}`);
  }
}
