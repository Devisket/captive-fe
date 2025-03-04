import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  getAllProducts(bankInfoId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + bankInfoId + "/Product");
  }

  addProductType(productType: any, bankInfoId: any) {
    return this.http.post(this.commandUrl + `bank/${bankInfoId}/product`, productType);
  }

  updateProductType(productType: any, bankInfoId: string, productId: string) {
    return this.http.put(this.commandUrl + `bank/${bankInfoId}/product/${productId}`, productType);
  }

  deleteProductType(bankInfoId: string, productId: string) {
    return this.http.delete(this.commandUrl + `bank/${bankInfoId}/product/${productId}`);
  }
}
