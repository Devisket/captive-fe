import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Bank } from '../../../_models/bank';
import { TabDirective, TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { BanksService } from '../../../_services/banks.service';
import { BranchListComponent } from '../../branches/branch-list/branch-list.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddBranchComponent } from '../../branches/add-branch/add-branch.component';
import { ProductListComponent } from "../../products/product-list/product-list.component";
import { FormCheckListComponent } from "../../form-checks/form-check-list/form-check-list.component";
import { BatchesService } from '../../../_services/batches.service';
import { ToastrService } from 'ngx-toastr';
import { AddBatchComponent } from "../../batches/add-batch/add-batch.component";
import { BatchListComponent } from "../../batches/batch-list/batch-list.component";
import { TagListComponent } from "../../tags/tag-list/tag-list.component";
import { CheckValidationListComponent } from '../../check-validation/check-validation-list/check-validation-list.component';
import { CheckInventoryListComponent } from '../../check-inventory/check-inventory-list/check-inventory-list.component';
import { Store } from '@ngrx/store';
import { getSelectedBankInfoId } from '../../../_store/shared/shared.selectors';
@Component({
  selector: 'app-bank-detail',
  standalone: true,
  imports: [
    TabsModule, NgFor, RouterLink, 
    DatePipe, BranchListComponent, NgIf, 
    ProductListComponent, 
    FormCheckListComponent, 
    AddBatchComponent, 
    BatchListComponent, 
    CheckValidationListComponent,
    CheckInventoryListComponent],
  templateUrl: './bank-detail.component.html',
  styleUrl: './bank-detail.component.scss'
})
export class BankDetailComponent implements OnInit{

  private bankService = inject(BanksService);
  private route = inject(ActivatedRoute);
  private batchService = inject(BatchesService);
  private toastr = inject(ToastrService);
  
  @ViewChild(BatchListComponent) private batchList!:BatchListComponent;

  bsModalRef: BsModalRef<AddBranchComponent> = new BsModalRef<AddBranchComponent>();
  modalService = inject(BsModalService);
  router = inject(Router)

  bank?: Bank;
  // activeTab?: TabDirective;
  activeTabset?: string;

  bankInfos: any;
  selectedBank: any = {};
  bankInfo?: Bank;


  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loadBank();
    this.activeTabset = localStorage.getItem('activeTabset') || 'Branches'; //

    this.store.select(getSelectedBankInfoId).subscribe(bankId => {
      console.log(bankId);
    })
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get('id');
    if (!bankId) return;
    this.bankService.getBanks().subscribe(data => {
      this.bankInfos = data.bankInfos;
      this.bankInfo = this.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  openAddBranchModal() {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      id: this.bankInfo?.id,
      initialState: {
        title: 'Add Branch',
        dataId: this.bankInfo?.id
      }
    }

    this.bsModalRef = this.modalService.show(AddBranchComponent, initialState);
  }

  onTabChange(data: TabDirective) {
    this.activeTabset = data.heading;
    if(this.activeTabset != undefined) localStorage.setItem('activeTabset', this.activeTabset);
  }

  addBatch(bankId: any, event: Event){
    if (!confirm('Confirm add new batch!')) {
      event.preventDefault();
      return;
    }
    this.batchService.addBatch(bankId).subscribe(
      {
        error: error => console.log(error),
        next: _ => {
          this.toastr.success("successfully added new batch.")
          this.batchList?.getBatches();
        },
        complete: () => window.location.reload()
      }
    )
  }


  onSelect(): void {

  }
}
