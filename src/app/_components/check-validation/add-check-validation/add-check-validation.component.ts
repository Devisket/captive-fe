import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Bank } from '../../../_models/bank';
import { BanksService } from '../../../_services/banks.service';
import { EnumsService } from '../../../_services/enums.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CheckValidationService } from '../../../_services/check-validation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-check-validation',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './add-check-validation.component.html',
  styleUrl: './add-check-validation.component.css'
})
export class AddCheckValidationComponent implements OnInit{
  @ViewChild('addCheckValidationForm') addCheckValidationForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.addCheckValidationForm?.dirty) {
      $event.returnValue = true;
    }
  }
  checkValidationServices = inject(CheckValidationService);
  router = inject(Router);
  bankService = inject(BanksService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  bankId = this.route.snapshot.paramMap.get("bankId");
  bankInfo?: Bank;
  enums = inject(EnumsService);
  validationTypes = this.enums.validationType();
  model: any = {};

  ngOnInit(): void {
    this.loadBank();
  }

  loadBank() {
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === this.bankId);
    });
  }

  addCheckValidation(){
    this.checkValidationServices.addCheckValidation(this.bankId, this.addCheckValidationForm?.value).subscribe({
      next: _ => {
        this.toastr.success("Successfully added new check validation");
        this.router.navigateByUrl('/banks/' + this.bankInfo?.id);
      },
      error: error => this.toastr.error(error, "Error"),
    })
  }

}
