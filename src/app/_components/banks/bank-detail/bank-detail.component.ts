import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Bank } from '../../../_models/bank';
import { TabDirective, TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe, NgFor } from '@angular/common';
import { BanksService } from '../../../_services/banks.service';
import { BranchListComponent } from '../../branches/branch-list/branch-list.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AddBranchComponent } from '../../branches/add-branch/add-branch.component';

@Component({
  selector: 'app-bank-detail',
  standalone: true,
  imports: [TabsModule, NgFor, RouterLink, DatePipe, BranchListComponent],
  templateUrl: './bank-detail.component.html',
  styleUrl: './bank-detail.component.css'
})
export class BankDetailComponent implements OnInit{

  private bankService = inject(BanksService);
  private route = inject(ActivatedRoute);
  
  bsModalRef: BsModalRef<AddBranchComponent> = new BsModalRef<AddBranchComponent>();
  modalService = inject(BsModalService);

  bank?: Bank;
  activeTab?: TabDirective;

  bankInfos: any;
  selectedBank: any = {};
  bankInfo?: Bank;

  ngOnInit(): void {
    this.loadBank();
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
        title: 'Add Branch'
      }
    }
    this.bsModalRef = this.modalService.show(AddBranchComponent, initialState);
  }

}
