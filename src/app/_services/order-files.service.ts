import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { CheckOrders } from '../_models/check-order';
import { LogDto } from '../_models/log-dto';
@Injectable({
  providedIn: 'root',
})
export class OrderFilesService {
  connectionId: string | undefined = undefined;
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

  getConnectionId = () => this.connectionId;

  private fetchConnectionId = () => {
    this.hubConnection!.invoke('GetConnectionId').then((data) => {
      console.log(data);
      this.connectionId = data;
    });
  };

  validateAllOrderFiles(bankId: string, batchId: string) {
    return this.http.post(
      this.commandUrl + `${bankId}/batch/${batchId}/validate`,
      null
    );
  }

  processAllOrderFiles(bankId: string, batchId: string) {
    return this.http.post(this.commandUrl + bankId + '/batch/' + batchId + '/process', null);
  }

  uploadOrderFiles(request: any) {
    return this.http.post(this.commandUrl + 'OrderFile/upload', request);
  }

  processOrderFile(id: string) {
    return this.http.post<LogDto>(
      this.commandUrl + 'orderfile/' + id + '/process',
      null
    );
  }

  validateOrderFile(orderFileId: string) {
    return this.http.post(
      this.commandUrl + 'orderfile/' + orderFileId + '/validate',
      null
    );
  }

  getOrderFiles(bankId: any, batchId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + bankId + '/Batch/' + batchId);
  }

  deleteOrderFile(id: string) {
    return this.http.delete(this.commandUrl + 'orderfile/' + id);
  }

  //Floating Check Orders

  getFloatingCheckOrders(orderFileId: string) {
    return this.http.get<any>(
      this.queryUrl + orderFileId + '/checkOrder'
    );
  }

  createFloatingCheckOrder(bankId: string, checkOrders: CheckOrders[]) {
    return this.http.post<any>(
      this.commandUrl + bankId + '/checkOrder/floating',
      checkOrders
    );
  }

  updateFloatingCheckOrder(
    bankId: string,
    checkOrders: CheckOrders[]
  ) {
    return this.http.put<any>(
      this.commandUrl + bankId + '/checkOrder/floating',
      checkOrders
    );
  }

  deleteFloatingCheckOrder(bankId: string, checkOrderId: string) {
    return this.http.delete<any>(this.commandUrl + bankId + '/checkOrder/floating/' + checkOrderId, { responseType: 'text' as 'json' });
  }

  holdFloatingCheckOrder(bankId: string, checkOrderId: string) {
    return this.http.post<any>(
      this.commandUrl +
        bankId +
        '/checkOrder/floating/hold/' +
        checkOrderId,
      null
    );
  }

  releaseFloatingCheckOrder(bankId: string, checkOrderId: string) {
    return this.http.post<any>(
      this.commandUrl +
        bankId +
        '/checkOrder/floating/release/' +
        checkOrderId,
      null
    );
  }
}
