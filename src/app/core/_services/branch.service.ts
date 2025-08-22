import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BankBranch } from '../../_models/bank-branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private http = inject(HttpClient);
  queryUrl = environment.queryUrl;
  commandUrl = environment.commandUrl;

  getBranches(bankId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + "Bank/" + bankId + "/branch");
  }

  getBranch(bankId : any, branchId: any): Observable<any> {
    return this.http.get<any>(this.queryUrl + "Bank/" + bankId + "/branch/" + branchId);
  }

  addBranch(branch: any, bankId: any) {
    return this.http.post(this.commandUrl + "BankInfo/" + bankId + "/branch", branch);
  }


  updateBranch(branch: BankBranch, bankId: any) {
    return this.http.put(this.commandUrl + "BankInfo/" + bankId + "/branch/" + branch.id, branch);
  }

  deleteBranch(bankId: any, branchId: any) {
    return this.http.delete(this.commandUrl + "BankInfo/" + bankId + "/branch/" + branchId);
  }
}
