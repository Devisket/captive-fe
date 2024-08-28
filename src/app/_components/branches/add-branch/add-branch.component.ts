import { ChangeDetectorRef, Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BranchService } from '../../../_services/branch.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { EnumsService } from '../../../_services/enums.service';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css'
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
  
  bsModalRef = inject(BsModalRef);
  title = '';
  statuses: any = [];
  tags: any = [];

  ngOnInit(): void {
    this.statuses = this.enums.branchStatus();
    this.tags = this.enums.branchTags();
    this.cdr.detectChanges();
  }
  model: any = {};

  addBranch(){
    const bankId = this.bsModalRef.id;
    this.branchService.addBranch(this.addBranchForm?.value, bankId).subscribe({
      next: _ => {
        this.toastr.success("Bank has been added successsfully");
        this.addBranchForm?.reset();
        this.bsModalRef.hide();
      },
      error: error => this.toastr.error("Not saved"),
      complete: () => window.location.reload()
    })
  }
}
