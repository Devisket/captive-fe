import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Bank } from '../../../_models/bank';
import { TagsService } from '../../../_services/tags.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { ToastrService } from 'ngx-toastr';
import { CheckValidation } from '../../../_models/check-validation';
import { CheckValidationService } from '../../../_services/check-validation.service';

@Component({
  selector: 'app-add-tag',
  standalone: true,
  imports: [FormsModule, RouterLink],
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
  router = inject(Router)
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
    });
  }

  loadCheckValidation() {
    let checkValidationId = this.route.snapshot.paramMap.get("checkValidationId");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!checkValidationId || !bankId) return;
    this.checkValidationServices.getCheckValidation(checkValidationId, bankId).subscribe(data => {
      this.checkValidation = data;
    });
  }


  addTag() {
    const formData = this.addTagForm?.value;
    if(this.checkValidation){
      formData['checkValidationId'] = this.checkValidation?.id;
    }
    console.log(formData)
    this.tagServices.addNewtag(this.bankInfo?.id, formData).subscribe({
      next: _ => {
        this.toastr.success( formData.tagName + " tag has been added successsfully");
      },
      error: error => this.toastr.error(error),
      complete: () => this.router.navigateByUrl('/tag-list/' + this.checkValidation?.id + '/bank/' + this.bankInfo?.id)
    })
  }
}
