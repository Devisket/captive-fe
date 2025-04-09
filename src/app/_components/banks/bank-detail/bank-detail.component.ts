import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Bank } from '../../../_models/bank';
import { NgFor, NgIf } from '@angular/common';
import { BanksService } from '../../../_services/banks.service';
import { BatchesService } from '../../../_services/batches.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { TabViewModule } from 'primeng/tabview';
import { BankDetailTab } from '../../../_models/template-dto/bank-detail-tab';
import { DialogService } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-bank-detail',
  standalone: true,
  imports: [TabViewModule, NgFor, NgIf, RouterOutlet],
  providers: [DialogService],
  templateUrl: './bank-detail.component.html',
  styleUrl: './bank-detail.component.scss',
})
export class BankDetailComponent implements OnInit {
  private bankService = inject(BanksService);
  private route = inject(ActivatedRoute);
  private batchService = inject(BatchesService);
  private toastr = inject(ToastrService);

  bank?: Bank;
  bankInfos: any;
  selectedBank: any = {};
  bankInfo?: Bank;
  activeTabIndex: number = 0;

  tabs: BankDetailTab[] = [
    { name: 'Branches', route: 'branches' },
    { name: 'Products', route: 'products' },
    { name: 'Batches', route: 'batches' },
    { name: 'Check Validations', route: 'check-validations' },
  ];

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.loadBank();
    // Set initial active tab based on current route
    const currentRoute =
      this.route.snapshot.firstChild?.routeConfig?.path || 'branches';
    this.router.navigate([currentRoute], { relativeTo: this.route });
    const tabIndex = this.tabs.findIndex((tab) => tab.route === currentRoute);
    if (tabIndex !== -1) {
      this.activeTabIndex = tabIndex;
    }
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get('id');
    if (!bankId) return;
    this.bankService.getBanks().subscribe((data) => {
      this.bankInfos = data.bankInfos;
      this.bankInfo = this.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  onTabChange(event: number) {
    const selectedTab = this.tabs[event];
    this.router.navigate([selectedTab.route], { relativeTo: this.route });
  }

  addBatch(bankId: any, event: Event) {
    // if (!confirm('Confirm add new batch!')) {
    //   event.preventDefault();
    //   return;
    // }
    // this.batchService.addBatch(bankId).subscribe({
    //   error: (error) => console.log(error),
    //   next: (_) => {
    //     this.toastr.success('successfully added new batch.');
    //     this.batchList?.getBatches();
    //   },
    //   complete: () => window.location.reload(),
    // });
  }
}
