import { Component, inject, OnInit } from '@angular/core';
import { BanksService } from '../../../_services/banks.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bank } from '../../../_models/bank';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [RouterLink, NgFor, FormsModule],
  templateUrl: './bank-list.component.html',
  styleUrl: './bank-list.component.css'
})
export class BankListComponent implements OnInit {
  bankService = inject(BanksService);
  router = inject(Router);
  private toastr = inject(ToastrService);
  bankInfos: Bank[] = [];

  ngOnInit(): void {
    this.getBanks();
  }

  getBanks() {
    this.bankService.getBanks().subscribe(data => {
      if(!data) return; 
      this.bankInfos = data.bankInfos;
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
        this.bankInfos = this.bankInfos.filter(bank => bank.id !== bankId);
      },
    });
  }
}
