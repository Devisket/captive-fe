import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BankBranch } from '../_models/bank-branch';

@Injectable({
  providedIn: 'root'
})
export class BankBranchService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getBankBranches() {
    return this.http.get<BankBranch[]>(this.baseUrl + 'bankbranches');
  }

  getBankBrach(bankBranchId: any) {
    return this.http.get<BankBranch>(this.baseUrl + 'bankbranches/' + bankBranchId);
  }
}
