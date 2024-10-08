import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  getProductTypes(bankInfoId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + bankInfoId + "/Product");
  }

  addProductType(productType: any, bankInfoId: any) {
    return this.http.post(this.commandUrl + "ProductType/bank/" + bankInfoId, productType);
  }

  updateProductType(productType: any, bankInfoId: string, productTypeId: string) {
    return this.http.put(this.commandUrl + "ProductType/bank/" + bankInfoId + '/' + productTypeId, productType);
  }

  deleteProductType(bankInfoId: string, productTypeId: string) {
    return this.http.delete(this.commandUrl + "ProductType/bank/" + bankInfoId + '/' + productTypeId);
  }
}
