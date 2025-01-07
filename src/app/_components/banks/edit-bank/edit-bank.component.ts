import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BanksService } from '../../../_services/banks.service';

@Component({
  selector: 'app-edit-bank',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-bank.component.html',
  styleUrl: './edit-bank.component.scss'
})
export class EditBankComponent implements OnInit{
  @ViewChild('editBankForm') editBankForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.editBankForm?.dirty) {
      $event.returnValue = true;
    }
  }
  
  private bankService = inject(BanksService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  bankInfos: any;
  selectedBank: any = {};
  bankInfo?: Bank

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

  addBank() {
    this.bankService.addBank(this.editBankForm?.value).subscribe({
      next: _ => {
        this.toastr.success("Bank has been updated successsfully");
        this.editBankForm?.reset();
        this.router.navigateByUrl('/banks');
      },
      error: error => this.toastr.error("Not saved")
    })
  }
}
