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

  addProduct(bankInfoId: string, product: Product) {
    return this.http.post(this.commandUrl + `bank/${bankInfoId}/product`, product);
  }

  updateProduct( bankInfoId: string, productId: string, product: Product) {
    return this.http.put(this.commandUrl + `bank/${bankInfoId}/product/${productId}`, product);
  }

  deleteProduct(bankInfoId: string, productId: string) {
    return this.http.delete(this.commandUrl + `bank/${bankInfoId}/product/${productId}`);
  }
}
