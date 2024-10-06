import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  addBatch(bankId: any) {
    return this.http.post(this.commandUrl + bankId + "/Batch", {});
  }

  getBatches(bankId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + "Batch/" + bankId);
  }

}
