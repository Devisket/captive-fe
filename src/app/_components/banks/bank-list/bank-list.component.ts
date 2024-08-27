import { Component, inject, OnInit } from '@angular/core';
import { BanksService } from '../../../_services/banks.service';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bank } from '../../../_models/bank';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [RouterLink, NgFor, FormsModule],
  templateUrl: './bank-list.component.html',
  styleUrl: './bank-list.component.css'
})
export class BankListComponent implements OnInit {
  bankService = inject(BanksService);
  bankInfos: Bank[] = [];
  selectedBank: any = {};

  ngOnInit(): void {
    this.getBanks();
  }

  getBanks() {
    this.bankService.getBanks().subscribe(data => {
      this.bankInfos = data.bankInfos;
    });
  }
}
