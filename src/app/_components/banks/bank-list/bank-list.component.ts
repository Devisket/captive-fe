import { Component, OnInit } from '@angular/core';
import { BanksService } from '../../../_services/banks.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Bank } from '../../../_models/bank';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { Store } from '@ngrx/store';
import {
  getBankValues,
  setSelectedBankInfoId,
} from '../../../_store/shared/shared.actions';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogService } from 'primeng/dynamicdialog';
import { AddBankComponent } from '../add-bank/add-bank.component';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [ButtonModule, RippleModule, FormsModule, TableModule],
  providers: [DialogService],
  templateUrl: './bank-list.component.html',
  styleUrl: './bank-list.component.scss',
})
export class BankListComponent implements OnInit {
  bankInfos: Bank[] = [];

  constructor(
    private bankService: BanksService,
    private toastr: ToastrService,
    private router: Router,
    private store: Store,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getBanks();
  }

  getBanks() {
    this.bankService.getBanks().subscribe((data) => {
      if (!data) return;

      this.bankInfos = data.bankInfos.sort((a: Bank, b: Bank) => {
        const nameA = a.bankName.toLowerCase();
        const nameB = b.bankName.toLowerCase();

        if (nameA < nameB) {
          return -1;
        } else if (nameB < nameA) {
          return 1;
        }

        return 0;
      });
    });
  }

  deleteBank(bankId: any, event: Event) {
    if (!confirm('Confirm Deletion!')) {
      event.preventDefault();
      return;
    }
    this.bankService.deleteBank(bankId).subscribe({
      error: (error) => {
        this.toastr.error(error.error);
        console.log(error.error);
      },
      next: (response) => {
        this.toastr.success('Successfully deleted bank.');
        this.bankInfos = this.bankInfos.filter((bank) => bank.id !== bankId);
      },
    });
  }

  onCreateNewBank() {
    const dialog = this.dialogService.open(AddBankComponent, {
      header: `Create New Bank`,
      width: '1000px',
      height: '50%',
    });
    dialog.onClose.subscribe({
      next: (_) => {
        this.getBanks();
      },
    });
  }

  navigateToBank(bank: Bank) {
    this.router.navigate(['banks', bank.id, 'bank-detail']);
    this.store.dispatch(setSelectedBankInfoId({ selectedBankInfoId: bank.id }));
    this.store.dispatch(getBankValues({ bankId: bank.id }));
  }

  onDeleteBank(bank: Bank) {
    this.bankService.deleteBank(bank.id).subscribe({
      next: (_) => {
        this.toastr.success('Bank has been deleted successfully');
        this.getBanks();
      },
    });
  }

  onEditBank(bank: Bank) {
    const dialog = this.dialogService.open(AddBankComponent, {
      header: `Edit Bank`,
      width: '1000px',
      height: '50%',
      data: {
        bank: bank,
      },
    });

    dialog.onClose.subscribe({
      next: (_) => {
        this.getBanks();
      },
    });
  }
}
