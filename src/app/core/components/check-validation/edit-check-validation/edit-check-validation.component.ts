import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CheckValidationService } from '../../../../core/_services/check-validation.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BanksService } from '../../../../core/_services/banks.service';
import { ToastrService } from 'ngx-toastr';
import { Bank } from '../../../../_models/bank';
import { EnumsService } from '../../../../core/_services/enums.service';
import { CheckValidation } from '../../../../_models/check-validation';

@Component({
  selector: 'app-edit-check-validation',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-check-validation.component.html',
  styleUrl: './edit-check-validation.component.scss'
})
export class EditCheckValidationComponent {
  @ViewChild('editCheckValidationForm') editCheckValidationForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.editCheckValidationForm?.dirty) {
      $event.returnValue = true;
    }
  }
  checkValidationServices = inject(CheckValidationService);
  router = inject(Router);
  bankService = inject(BanksService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  bankId = this.route.snapshot.paramMap.get("bankId");
  checkValidationId = this.route.snapshot.paramMap.get("checkValidationId");
  checkValidation?: CheckValidation;
  bankInfo?: Bank;
  enums = inject(EnumsService);
  validationTypes = this.enums.validationType();
  model: any = {};

  ngOnInit(): void {
    this.loadBank();
    //this.loadCheckValidation();
  }

  loadBank() {
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === this.bankId);
    });
  }

  // loadCheckValidation() {
  //   this.checkValidationServices.getCheckValidation(this.checkValidationId, this.bankId).subscribe(data => {
  //     this.checkValidation = data;
  //   });
  // }


  // updateCheckValidation(){
  //   this.checkValidationServices.updateCheckValidation(this.bankId, this.checkValidationId, this.editCheckValidationForm?.value).subscribe({
  //     next: _ => {
  //       this.toastr.success("Successfully updated check validation");
  //       this.router.navigateByUrl('/banks/' + this.bankInfo?.id);
  //     },
  //     error: error => this.toastr.error(error, "Error"),
  //   })
  // }
}
