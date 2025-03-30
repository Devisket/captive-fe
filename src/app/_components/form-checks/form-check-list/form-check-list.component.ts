import { Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { FormCheckService } from '../../../_services/form-check.service';
import { ToastrService } from 'ngx-toastr';
import { FormCheck } from '../../../_models/form-check';
import { NgFor } from '@angular/common';
import { Product } from '../../../_models/product';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Bank } from '../../../_models/bank';

@Component({
  selector: 'app-form-check-list',
  standalone: true,
  imports: [NgFor, FormsModule, RouterLink],
  templateUrl: './form-check-list.component.html',
  styleUrl: './form-check-list.component.scss'
})
export class FormCheckListComponent implements OnInit{

  productType = input.required<Product>();
  bankInfo = input.required<Bank>();

  formCheckService = inject(FormCheckService);
  toastr = inject(ToastrService);
  formChecks: FormCheck[] = [];
  ngOnInit(): void {
    this.productType;
    this.bankInfo;
    this.getFormCheckByProductId()
  }

  getFormCheckByProductId() {
    this.formCheckService.getFormCheckByProductId(this.bankInfo().id, this.productType().productId).subscribe(data => {
      if(!data) return; 
      this.formChecks = data.formChecks;
    });
  }

  deleteFormCheck(formCheckId: string, event: Event){

    const productId = this.productType().productId; 
    console.log(formCheckId, productId);
    if (!confirm('Confirm Deletion!')) {
      event.preventDefault();
      return;
    }
    this.formCheckService.deleteFormCheck(productId, formCheckId).subscribe({
      error: error => this.toastr.error(error),
      next: _ => {
        this.toastr.success("Successfully deleted bank form check");
        this.formChecks = this.formChecks.filter(formCheck => formCheck.id !== formCheckId);
      }
    });
  }
}
