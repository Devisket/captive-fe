import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { Bank } from '../../../_models/bank';
import { BankBranch } from '../../../_models/bank-branch';
import { BranchService } from '../../../_services/branch.service';
import { ToastrService } from 'ngx-toastr';
import { EditBranchComponent } from '../edit-branch/edit-branch.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SharedFeature } from '../../../_store/shared/shared.reducer';
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
        console.log(data);
        if (!data) return;
        this.branches = data.branches;
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

  openEditBranchModal(branchId: any) {
    this.branch = this.branches.find((branch) => branch.id === branchId);

    this.dialogService.open(EditBranchComponent, {
      header: 'Edit Branch',
      width: '70%',
      data: {
        branchId: this.branch?.id,
        bankInfoId: this.bankId,
      },
    });
  }
}
