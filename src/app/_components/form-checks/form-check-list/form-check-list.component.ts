import { Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { FormCheckService } from '../../../_services/form-check.service';
import { ToastrService } from 'ngx-toastr';
import { FormCheck } from '../../../_models/form-check';
import { NgFor } from '@angular/common';
import { ProductType } from '../../../_models/product-type';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-form-check-list',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './form-check-list.component.html',
  styleUrl: './form-check-list.component.css'
})
export class FormCheckListComponent implements OnInit{

  productType = input.required<ProductType>();
  formCheckService = inject(FormCheckService);
  toastr = inject(ToastrService);
  formChecks: FormCheck[] = [];
  ngOnInit(): void {
    this.productType;
    this.getFormChecks()
  }

  getFormChecks() {
    this.formCheckService.getFormChecks(this.productType().productTypeId, this.productType().productTypeId).subscribe(data => {
      this.formChecks = data.bankFormChecks;
    });
  }

  deleteFormCheck(formCheckId: string, event: Event){
    const productTypeId = this.productType().productTypeId;
    if (!confirm('Confirm Deletion!')) {
      event.preventDefault();
      return;
    }
    this.formCheckService.deleteFormCheck(productTypeId, formCheckId).subscribe({
      error: error => this.toastr.error(error),
      next: _ => {
        this.toastr.success("Successfully deleted bank form check");
        this.formChecks = this.formChecks.filter(formCheck => formCheck.id !== formCheckId);
      }
    });
  }
}
