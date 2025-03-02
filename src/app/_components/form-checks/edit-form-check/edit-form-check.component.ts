import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BanksService } from '../../../_services/banks.service';
import { ProductTypeService } from '../../../_services/product-type.service';
import { FormCheckService } from '../../../_services/form-check.service';
import { Bank } from '../../../_models/bank';
import { Product } from '../../../_models/product';
import { FormCheck } from '../../../_models/form-check';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-form-check',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-form-check.component.html',
  styleUrl: './edit-form-check.component.scss'
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
  formCheck?: FormCheck;
  location = inject(Location);
  model: any = {};
  bankInfoId = this.route.snapshot.paramMap.get("bankId");
  productId = '';

  ngOnInit(): void {
    this.getFormCheck();
  }
  
  getFormCheck(){
    this.productId = this.route.snapshot.paramMap.get("productId") ?? '';
    let formCheckId = this.route.snapshot.paramMap.get("id");

    this.formCheckService.getFormChecks(this.productId).subscribe( data => {
      if(data.formChecks){
        this.formCheck = data.formChecks.find((formCheck: FormCheck) => formCheck.id === formCheckId);
      }      
    })
  }


  editFormCheck() {
    if(!this.formCheck) return;
    this.formCheckService.updateFormCheck(this.editFormCheckForm?.value, this.productId).subscribe({
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
