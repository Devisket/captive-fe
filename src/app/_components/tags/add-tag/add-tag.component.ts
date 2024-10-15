import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Bank } from '../../../_models/bank';
import { TagsService } from '../../../_services/tags.service';
import { ActivatedRoute } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { ToastrService } from 'ngx-toastr';
import { CheckValidation } from '../../../_models/check-validation';
import { CheckValidationService } from '../../../_services/check-validation.service';

@Component({
  selector: 'app-add-tag',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-tag.component.html',
  styleUrl: './add-tag.component.css'
})
export class AddTagComponent implements OnInit{

  @ViewChild('addTagForm') addTagForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.addTagForm?.dirty) {
      $event.returnValue = true;
    }
  }

  tagServices = inject(TagsService);
  bankService = inject(BanksService);
  checkValidationServices = inject(CheckValidationService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  bankInfo?: Bank;
  checkValidation?: CheckValidation;
  model: any = {};

  ngOnInit(): void {
    this.loadBank();
    this.loadCheckValidation();
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!bankId) return;
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
      console.log(this.bankInfo);
    });
  }

  loadCheckValidation() {
    let checkValidationId = this.route.snapshot.paramMap.get("checkValidationId");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!checkValidationId) return;
    this.checkValidationServices.getCheckValidation(checkValidationId, bankId).subscribe(data => {
      this.checkValidation = data.checkValidation;
      console.log(this.checkValidation);
    });
  }


  addTag() {
    const values = this.addTagForm?.value;
    this.tagServices.addNewtag(this.bankInfo?.id, values).subscribe({
      next: _ => {
        this.toastr.success( values.tagName + " tag has been added successsfully");
      },
      error: error => this.toastr.error(error),
      complete: () => window.location.reload()
    })
  }
}
