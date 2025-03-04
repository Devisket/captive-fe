import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductConfigurationService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  getProductConfigurations(productId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + "bankId/Product/" + productId + "/configuration");
  }

  addProductConfigurations(productId: any, bankInfoId: any, productTypeConfiguration: any) {
    return this.http.post(this.commandUrl + "bank/" + bankInfoId + "/product/" + productId + "/configuration", productTypeConfiguration);
  }

  updateProductConfigurations(productId: any, bankInfoId: any, productConfigurationId: any, productTypeConfiguration: any) {
    return this.http.put(this.commandUrl + "bank/" + bankInfoId + "/product/" + productId + "/configuration/" + productConfigurationId, productTypeConfiguration);
  }
}
