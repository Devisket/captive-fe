import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { CheckOrders } from '../../_models/check-order';
import { LogDto } from '../../_models/log-dto';
import { OrderFile } from '../../_models/order-file';
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
  private orderFileStatusSubject = new Subject<OrderFile>();
  public orderFileStatus$ = this.orderFileStatusSubject.asObservable();

  startConnection(batchId?: string) {
    // Don't create a new connection if one already exists and is connected
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR connection already exists and is connected');
      if (batchId) {
        this.joinBatchGroup(batchId);
      }
      return;
    }

    // Stop existing connection if it exists
    if (this.hubConnection) {
      console.log('Stopping existing SignalR connection');
      this.hubConnection.stop();
    }

    console.log('Creating new SignalR connection to:', this.baseCommandUrl + '/orderfile');
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseCommandUrl + '/orderfile')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up event listeners BEFORE starting the connection
    this.hubConnection.on('orderFileStatusUpdate', (orderFile: OrderFile) => {
      console.log('Received order file status update:', orderFile);
      this.orderFileStatusSubject.next(orderFile);
    });

    this.hubConnection.on('testMessage', (message: string) => {
      console.log('Test message received:', message);
    });

    // Handle connection closed
    this.hubConnection.onclose((error) => {
      console.log('SignalR connection closed:', error);
    });

    // Start the connection
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started successfully');
        console.log('Connection state:', this.hubConnection?.state);
        return this.fetchConnectionId();
      })
      .then(() => {
        if (batchId) {
          this.joinBatchGroup(batchId);
        }
      })
      .catch((err) => {
        console.error('Error while starting SignalR connection:', err);
        console.error('Base URL:', this.baseCommandUrl);
        console.error('Full URL:', this.baseCommandUrl + '/orderfile');
      });
  }

  joinBatchGroup(batchId: string) {
    if (this.hubConnection) {
      console.log(`Attempting to join batch group: ${batchId}`);
      this.hubConnection.invoke('JoinBatchGroup', batchId)
        .then(() => {
          console.log(`Successfully joined batch group: ${batchId}`);
          console.log('Hub connection state:', this.hubConnection?.state);
        })
        .catch(err => console.error('Error joining batch group:', err));
    } else {
      console.error('Hub connection is not available when trying to join batch group');
    }
  }

  leaveBatchGroup(batchId: string) {
    if (this.hubConnection) {
      this.hubConnection.invoke('LeaveBatchGroup', batchId)
        .then(() => console.log(`Left batch group: ${batchId}`))
        .catch(err => console.error('Error leaving batch group:', err));
    }
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('Connection stopped'))
        .catch(err => console.error('Error stopping connection:', err));
    }
  }

  testConnection() {
    console.log('Testing connection...');
    console.log('Hub connection state:', this.hubConnection?.state);
    console.log('Base command URL:', this.baseCommandUrl);
    
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('TestConnection', 'Hello from frontend')
        .then(() => console.log('Test message sent successfully'))
        .catch(err => console.error('Error sending test message:', err));
    } else {
      console.error('Hub connection is not available or not connected');
      console.log('Current connection state:', this.hubConnection?.state);
    }
  }

  getConnectionStatus() {
    return {
      state: this.hubConnection?.state,
      baseUrl: this.baseCommandUrl,
      connectionId: this.connectionId
    };
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
