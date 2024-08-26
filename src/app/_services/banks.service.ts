import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Bank } from '../_models/bank';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanksService {
  private http = inject(HttpClient);
  queryUrl = environment.queryUrl;

  getBanks(): Observable<any> {
    return this.http.get<any>(this.queryUrl + "Bank");
  }
}
