import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Bank } from '../_models/bank';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanksService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  banks = signal<Bank[]>([]);

  getBanks() {
    return this.http.get<Bank[]>(this.baseUrl + 'banks').subscribe({
      next: banks => this.banks.set(banks)
    });
  }

  getBank(bankId: any) {
    const bank = this.banks().find(x => x.id == bankId);
    if( bank !== undefined) return of(bank);
    return this.http.get<Bank>(this.baseUrl + 'banks/' + bankId);
  }

  updateBank(bank: Bank, bankId: any) {
    return this.http.put(this.baseUrl + 'banks/' + bankId, bank).pipe(
      tap(() => {
        this.banks.update(banks => banks.map(m => m.id == bank.id ? bank : m))
      })
    );
  }

  addBank(bank: Bank) {
    return this.http.post(this.baseUrl + 'banks/add-bank', bank).pipe(
      tap(() => {
        this.banks.update(banks => banks.map(m => m.id == bank.id ? bank : m))
      })
    );
  }
}
