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
import { Subscription } from 'rxjs';
import { SharedFeature } from '../../../_store/shared/shared.reducer';
import { getBankValues } from '../../../_store/shared/shared.actions';
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

  bankId = this.route.snapshot.paramMap.get('id');
  bank?: Bank;
  bankInfos: any;
  selectedBank: any = {};
  bankInfo?: Bank;
  activeTabIndex: number = 0;

  subscription$ = new Subscription();

  tabs: BankDetailTab[] = [
    { name: 'Branches', route: 'branches' },
    { name: 'Products', route: 'products' },
    { name: 'Batches', route: 'batches' },
    { name: 'Check Validations', route: 'check-validations' },
  ];

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.loadBank();
    this.loadBankValues();

    this.subscription$.add(
      this.store
        .select(SharedFeature.selectBankValues)
        .subscribe((bankValues) => {
          console.log(bankValues);
        })
    );
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

  loadBankValues() {
    this.store.dispatch(getBankValues({ bankId: this.bankId! }));
  }

  onTabChange(event: number) {
    const selectedTab = this.tabs[event];
    this.router.navigate([selectedTab.route], { relativeTo: this.route });
  }

  addBatch(bankId: any, event: Event) {
  }
}
