import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { Bank } from '../../../../_models/bank';
import { BankBranch } from '../../../../_models/bank-branch';
import { BranchService } from '../../../_services/branch.service';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SharedFeature } from '../../../../shared/_store/shared.reducer';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss',
})
export class BranchListComponent implements OnInit {
  private branchServices = inject(BranchService);
  branches: BankBranch[] = [];
  branch?: BankBranch;
  toastr = inject(ToastrService);
  bankId: string | undefined = undefined;
  bankId$: Observable<string | null> = new Observable<string | null>();
  constructor(private store: Store, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.bankId$ = this.store.select(SharedFeature.selectSelectedBankInfoId);

    this.bankId$.subscribe((x) => {
      this.bankId = x ?? undefined;
      this.getBranches();
    });
  }

  getBranches() {
    console.log(this.bankId);
    if (this.bankId) {
      this.branchServices.getBranches(this.bankId).subscribe((data) => {

        if (!data) return;
        
        this.branches = data.branches;

        this.branches.sort((a, b) => a.branchName.localeCompare(b.branchName));

      });
    }
  }

  deleteBranch(bankId: any, branchId: any, event: Event) {
    if (!confirm('Confirm Deletion!')) {
      event.preventDefault();
      return;
    }
    this.branchServices.deleteBranch(bankId, branchId).subscribe({
      error: (error) => console.log(error),
      next: (_) => {
        this.toastr.success('successfully deleted branch.');
        this.branches = this.branches.filter(
          (branch) => branch.id !== branchId
        );
      },
    });
  }


  onAddBranch() {
  }


}
