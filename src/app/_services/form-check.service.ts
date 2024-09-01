import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormCheckService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  getFormChecks(productTypeId: any, bankInfoId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + "FormChecks/bank/" + bankInfoId + '?productId=' + productTypeId);
  }

  addFormCheck(formCheck: any, bankInfoId: any) {
    return this.http.post(this.commandUrl + "FormChecks/Bank/" + bankInfoId, formCheck);
  }

  updateFormCheck(formCheck: any, bankInfoId: string, formCheckId: string) {
    return this.http.put(this.commandUrl + "FormChecks/Bank/" + bankInfoId + '/' + formCheckId, formCheck);
  }

  deleteFormCheck(bankInfoId: string, formCheckId: string) {
    return this.http.delete(this.commandUrl + "FormChecks/Bank/" + bankInfoId + '/' + formCheckId);
  }
}
