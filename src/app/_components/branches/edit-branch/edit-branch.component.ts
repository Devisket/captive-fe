import { Component, HostListener, inject, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BranchService } from '../../../_services/branch.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EnumsService } from '../../../_services/enums.service';
import { BankBranch } from '../../../_models/bank-branch';

@Component({
  selector: 'app-edit-branch',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-branch.component.html',
  styleUrl: './edit-branch.component.scss'
})
export class EditBranchComponent {
  @ViewChild('editBranchForm') editBranchForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.editBranchForm?.dirty) {
      $event.returnValue = true;
    }
  }
  branchService = inject(BranchService);
  toastr = inject(ToastrService);
  router = inject(Router);
  enums = inject(EnumsService);




  
  @Input() title?: string;
  @Input() branchId?: string;
  @Input() bankInfoId?: string;

  branch?: BankBranch;
  branches: BankBranch[] = [];

  statuses: any = [];

  ngOnInit(): void {
    this.statuses = this.enums.branchStatus();
    this.getBranch();
    this.getBranches();
  }

  getBranch() {
    this.branchService.getBranch(this.bankInfoId, this.branchId).subscribe(branch => {
      if (branch.branches && branch.branches.length > 0) {
        this.branch = branch.branches[0];
        console.log(this.branch);
      } else {
        this.toastr.info('No branches found.');
      }
    });
  }


  updateBranch(){
    this.branchService.updateBranch(this.editBranchForm?.value, this.bankInfoId).subscribe({
      next: _ => {
        this.toastr.success("Bank has been updated successsfully");
        this.editBranchForm?.reset();
      },
      error: error => console.log(error),
      complete: () => window.location.reload()
    })
  }

  getBranches() {
    this.branchService.getBranches(this.bankInfoId).subscribe(data => {
      if(!data) return;
      this.branches = data.branches.filter((branch: BankBranch) => branch.id != this.branchId);
    });
  }

}
