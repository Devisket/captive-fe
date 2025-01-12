import { ChangeDetectorRef, Component, HostListener, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BranchService } from '../../../_services/branch.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EnumsService } from '../../../_services/enums.service';
import { BankBranch } from '../../../_models/bank-branch';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.scss'
})
export class AddBranchComponent implements OnInit{
  @ViewChild('addBranchForm') addBranchForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.addBranchForm?.dirty) {
      $event.returnValue = true;
    }
  }

  branchService = inject(BranchService);
  toastr = inject(ToastrService);
  router = inject(Router);
  enums = inject(EnumsService);
  private cdr = inject(ChangeDetectorRef);
  branches: BankBranch[] = [];

  @Input() title?: string;
  @Input() dataId?: string;


  bsModalRef = inject(BsModalRef);
  statuses: any = [];
  tags: any = [];

  ngOnInit(): void {
    this.statuses = this.enums.branchStatus();
    this.tags = this.enums.branchTags();
    this.cdr.detectChanges();
    this.getBranches();

  }
  model: any = {};

  addBranch(){
    const values = this.bsModalRef.id;
    this.branchService.addBranch(this.addBranchForm?.value, values).subscribe({
      next: _ => {
        this.toastr.success("Bank has been added successsfully");
        this.addBranchForm?.reset();
        this.bsModalRef.hide();
      },
      error: error => this.toastr.error("Not saved"),
      complete: () => window.location.reload()
    })
  }

  getBranches() {
    this.branchService.getBranches(this.dataId).subscribe(data => {
      if(!data) return;
      this.branches = data.branches;
    });
  }

}
