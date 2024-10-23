import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BanksService } from '../../../_services/banks.service';
import { ProductTypeService } from '../../../_services/product-type.service';
import { FormCheckService } from '../../../_services/form-check.service';
import { Bank } from '../../../_models/bank';
import { ProductType } from '../../../_models/product-type';
import { FormCheck } from '../../../_models/form-check';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-form-check',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-form-check.component.html',
  styleUrl: './edit-form-check.component.css'
})
export class EditFormCheckComponent {
  @ViewChild('editFormCheckForm') editFormCheckForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.editFormCheckForm?.dirty) {
      $event.returnValue = true;
    }
  }
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  bankService = inject(BanksService);
  productTypeService = inject(ProductTypeService);
  formCheckService = inject(FormCheckService);
  productType?: ProductType;
  formCheck?: FormCheck;
  location = inject(Location);
  model: any = {};
  bankInfoId = this.route.snapshot.paramMap.get("bankId");

  ngOnInit(): void {
    this.getFormCheck();
  }
  
  getFormCheck(){
    let productTypeId = this.route.snapshot.paramMap.get("productId");
    let formCheckId = this.route.snapshot.paramMap.get("id");
    console.log(this.bankInfoId, formCheckId, productTypeId);

    this.formCheckService.getFormChecks(productTypeId).subscribe( data => {
      if(data.formChecks){
        this.formCheck = data.formChecks.find((formCheck: FormCheck) => formCheck.id === formCheckId);
      }      
    })
  }


  editFormCheck() {
    if(!this.bankInfoId) return;
    let bankId = this.bankInfoId;
    if(!this.formCheck) return;
    this.formCheckService.updateFormCheck(this.editFormCheckForm?.value, bankId , this.formCheck?.id).subscribe({
      next: _ => {
        this.toastr.success(" Form check has been added successsfully");
        this.router.navigateByUrl('/banks/' + this.bankInfoId);
      },
      error: error => this.toastr.error(error)
    })
  }

  goBack(): void {
    this.location.back();
  }
  
}
