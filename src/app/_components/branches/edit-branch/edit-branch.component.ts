import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BranchService } from '../../../_services/branch.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EnumsService } from '../../../_services/enums.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BankBranch } from '../../../_models/bank-branch';

@Component({
  selector: 'app-edit-branch',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-branch.component.html',
  styleUrl: './edit-branch.component.css'
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
  
  bsModalRef = inject(BsModalRef);
  title = '';
  branchId = '';
  bankInfoId = '';

  branch?: BankBranch;
  branches: BankBranch[] = [];

  tags: any = [];

  ngOnInit(): void {
    this.tags = this.enums.branchTags();
    this.getBranch();
  }

  getBranch() {
    this.branchService.getBranch(this.bankInfoId, this.branchId).subscribe(branch => {
      if (branch.branches && branch.branches.length > 0) {
        this.branch = branch.branches[0];
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
        this.bsModalRef.hide();
      },
      error: error => console.log(error),
      complete: () => window.location.reload()
    })
  }
}
