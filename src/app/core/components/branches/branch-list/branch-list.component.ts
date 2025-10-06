import { Component, OnInit, inject } from '@angular/core';
import { Bank } from '../../../../_models/bank';
import { BankBranch } from '../../../../_models/bank-branch';
import { BranchService } from '../../../_services/branch.service';
import { ToastrService } from 'ngx-toastr';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SharedFeature } from '../../../../shared/_store/shared.reducer';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AddBranchComponent } from '../add-branch/add-branch.component';
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
    this.OpenAddBranchDialog({
      header: 'Add Branch',
      width: '50%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data:{
        onSubmit: (bankBranch: BankBranch) => {
          console.log(bankBranch);
        }
      }
    });
  }

  onDeleteBranch(branch: BankBranch, event: Event) {}

  onUpdateBranch(branch: BankBranch) {
    console.log(branch);
    this.OpenAddBranchDialog({
      header: 'Add Branch',
      width: '50%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data:{
        branchData: branch,
        onSubmit: (bankBranch: BankBranch) => this.OnSubmitBranch(bankBranch)
      }
    });
  }

  private OpenAddBranchDialog(dialogConfig: DynamicDialogConfig) {
    const dialogRef = this.dialogService.open(AddBranchComponent, dialogConfig);
  }

  OnSubmitBranch(bankBranch: BankBranch) {
    console.log(bankBranch);
  }

}
