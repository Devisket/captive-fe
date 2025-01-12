import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class OrderFilesService {

  connectionId:string | undefined = undefined;
  private http = inject(HttpClient);
  baseCommandUrl = environment.baseCommandUri;
  commandUrl = environment.commandUrl;
  queryUrl = environment.queryUrl;

  private hubConnection: signalR.HubConnection | undefined;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseCommandUrl + '/orderfile')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(() => this.fetchConnectionId())
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  getConnectionId = ()=> this.connectionId;

  private fetchConnectionId = () => {
    this.hubConnection!.invoke('GetConnectionId')
    .then((data) => {
      console.log(data);
      this.connectionId = data;
    });
  }

  uploadOrderFiles(request: any) {
    return this.http.post(this.commandUrl + 'OrderFile/upload', request);
  }

  validateOrderFile(id:string) {
    return this.http.post(this.commandUrl + 'orderfile/' + id + '/validate',null)
  }

  processOrderFile(id:string) {
    return this.http.post(this.commandUrl + 'orderfile/' + id + '/process',null)
  }

  getOrderFiles(bankId: any, batchId: any, headers: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + bankId + '/Batch/' + batchId, {
      headers,
    });
  }

  deleteOrderFile(id: string) {
    return this.http.delete(this.commandUrl + 'orderfile/' + id);
  }
}
