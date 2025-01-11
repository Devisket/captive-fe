import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderFilesService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  uploadOrderFiles(request: any) {
    return this.http.post(this.commandUrl  + "OrderFile/upload", request);
  }

  getOrderFiles(bankId: any, batchId: any, headers: any): Observable<any>{
    return this.http.get<any>(this.queryUrl + bankId + "/Batch/" + batchId, { headers });
  }

  deleteOrderFile(id:string){
    return this.http.delete(this.commandUrl + "orderfile/" + id);
  }

}
