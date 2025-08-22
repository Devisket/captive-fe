import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class BatchesService {
  private http = inject(HttpClient);
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;
  baseCommandUrl = environment.baseCommandUri;

  connectionId: string | undefined = undefined;
  private hubConnection: signalR.HubConnection | undefined;

  startConnection(batchId:string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseCommandUrl + '/batch')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(() => this.fetchConnectionId())
      .then(()=> this.addBatchListener(batchId))
      .then(()=> this.invokeFetchBatchData(batchId))
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  getConnectionId = () => this.connectionId;

  private fetchConnectionId = () => {
    this.hubConnection!.invoke('GetConnectionId').then((data) => {
      console.log(data);
      this.connectionId = data;
    });
  };

  invokeFetchBatchData(batchId:string){
    this.hubConnection!.invoke('InvokeGetBatch',batchId);
  }

  public addBatchListener = (batchId:string) => {
    this.hubConnection!.on(`batch:${batchId}`, (data) => {
      console.log(data);
    });
  }

  addBatch(bankId: any, date: string, batchName: string | null): Observable<any> {
    return this.http.post(this.commandUrl + bankId + '/Batch', {deliveryDate: date, batchName: batchName});
  }

  getBatches(bankId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + bankId + '/Batch');
  }

  deleteBatch(bankId:any, batchId:any) :Observable<any> 
  {
    return this.http.delete<any>(this.commandUrl +  `${bankId}/Batch/${batchId}`);
  }
}
