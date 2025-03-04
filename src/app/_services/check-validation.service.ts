import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckValidationService {

  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  getAllTagAndMapping(bankInfoId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + bankInfoId + '/tag');
  }

  // getCheckValidations(bankInfoId: any): Observable<any> {
  //   return this.http.get<any>(this.queryUrl + bankInfoId + '/CheckValidation');
  // }

  // getCheckValidation(checkValidationId: any, bankInfoId: any): Observable<any> {
  //   return this.http.get<any>(this.queryUrl + bankInfoId + '/CheckValidation/' + checkValidationId);
  // }

  // addCheckValidation(bankInfoId: any, formData: any) {
  //   return this.http.post(this.commandUrl + bankInfoId + "/CheckValidation", formData);
  // }

  // updateCheckValidation(bankInfoId: any, checkValidationId: any, formData: any) {
  //   return this.http.put(this.commandUrl + bankInfoId + "/CheckValidation/" + checkValidationId, formData);
  // }
}
