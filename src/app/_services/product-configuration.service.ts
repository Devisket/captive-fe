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

  getProductConfigurations(poductTyeId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + "bankId/Product/" + poductTyeId + "/configuration");
  }


  addProductConfigurations(productTypeId: any, bankInfoId: any, productTypeConfiguration: any) {
    return this.http.post(this.commandUrl + "bank/" + bankInfoId + "/Product/" + productTypeId + "/configuration", productTypeConfiguration);
  }
}
