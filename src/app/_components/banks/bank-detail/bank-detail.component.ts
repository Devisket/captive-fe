import { Component, inject, OnInit } from '@angular/core';
import { BanksService } from '../../../_services/BanksService';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Bank } from '../../../_models/bank';
import { TabDirective, TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-bank-detail',
  standalone: true,
  imports: [TabsModule, NgFor, RouterLink, DatePipe],
  templateUrl: './bank-detail.component.html',
  styleUrl: './bank-detail.component.css'
})
export class BankDetailComponent implements OnInit{

  private bankService = inject(BanksService);
  private route = inject(ActivatedRoute);
  bank?: Bank;
  activeTab?: TabDirective;
  
  ngOnInit(): void {
    this.loadBank();
  }

  loadBank() {
    const bankId = this.route.snapshot.paramMap.get('id');
    if(!bankId) return;
    //this.bankService.getBank(bankId).subscribe({
    //  next: bank => this.bank = bank
    //})
  }
}
