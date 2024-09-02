import { ChangeDetectorRef, Component, OnInit, inject, input } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { BankBranch } from '../../../_models/bank-branch';
import { BranchService } from '../../../_services/branch.service';
import { AddBranchComponent } from '../add-branch/add-branch.component';
import { ToastrService } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EditBranchComponent } from '../edit-branch/edit-branch.component';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [AddBranchComponent, BsDropdownModule],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.css'
})
export class BranchListComponent implements OnInit{
  private branchServices = inject(BranchService);
  bankInfo = input.required<Bank>();
  branches: BankBranch[] = [];
  branch?: BankBranch;
  toastr = inject(ToastrService);
  bsModalRef: BsModalRef<EditBranchComponent> = new BsModalRef<EditBranchComponent>();
  modalService = inject(BsModalService);

  ngOnInit(): void {
    this.bankInfo;
    this.getBranches();
  }

  getBranches() {
    const bankId = this.bankInfo().id;
    this.branchServices.getBranches(bankId).subscribe(data => {
      if(!data) return; 
      this.branches = data.branches;
    });
  }

  deleteBranch(bankId: any, branchId: any, event: Event){
    if (!confirm('Confirm Deletion!')) {
      event.preventDefault();
      return;
    }
    this.branchServices.deleteBranch(bankId, branchId).subscribe(
      {
        error: error => console.log(error),
        next: _ => {
          this.toastr.success("successfully deleted branch.")
          this.branches = this.branches.filter(branch => branch.id !== branchId);
        }
      }
    )
  }

  openEditBranchModal(branchId: any) {
      this.branch = this.branches.find(branch => branch.id === branchId);
      const initialState: ModalOptions = {
      class: 'modal-lg',
      id: this.branch?.id,
      initialState: {
        title: 'Edit Branch',
        branchId: this.branch?.id,
        bankInfoId: this.bankInfo().id,
      }
    }
    this.bsModalRef = this.modalService.show(EditBranchComponent, initialState);
  }



}
