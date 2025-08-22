import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Bank } from '../../_models/bank';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanksService {
  private http = inject(HttpClient);
  queryUrl = environment.queryUrl;
  commandUrl = environment.commandUrl;
  bankInfos: Bank[] = [];

  getBanks(): Observable<any> {
    return this.http.get<any>(this.queryUrl + "Bank");
  }

  addBank(bank: any) {
    return this.http.post(this.commandUrl + "BankInfo", bank);
  }

  deleteBank(bankId: any) {
    return this.http.delete(this.commandUrl + "BankInfo/id/" + bankId);
  }

  getbankInfos() {
    this.http.get<any>(this.queryUrl + "Bank").subscribe(data => {
      this.bankInfos = data.bankInfos;
    });
  }
}
