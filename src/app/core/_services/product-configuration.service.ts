import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ProductConfiguration } from '../../_models/product-configuration';

@Injectable({
  providedIn: 'root'
})
export class ProductConfigurationService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  getProductConfigurations(productId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + productId + "/productConfiguration");
  }

  addProductConfigurations(productId: any, productTypeConfiguration: any) {
    return this.http.post(this.commandUrl + productId + "/productConfiguration", productTypeConfiguration);
  }

  updateProductConfigurations(productId: any, productConfigurationId: any, productTypeConfiguration: any) {
    return this.http.put(this.commandUrl +  productId + "/productConfiguration/" + productConfigurationId, productTypeConfiguration);
  }
}
