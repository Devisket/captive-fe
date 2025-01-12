import { Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ProductTypeService } from '../../../_services/product-type.service';
import { ProductType } from '../../../_models/product-type';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormCheckListComponent } from '../../form-checks/form-check-list/form-check-list.component';
import { FormsModule, NgForm } from '@angular/forms';
import { FormCheckService } from '../../../_services/form-check.service';

@Component({
  selector: 'app-product-type-list',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule, NgFor, FormCheckListComponent, UpperCasePipe],
  templateUrl: './product-type-list.component.html',
  styleUrl: './product-type-list.component.scss'
})
export class ProductTypeListComponent implements OnInit{
  visibleProductTypes: { [key: string]: boolean } = {};

  toggleFormCheckList(productTypeId: string): void {
    this.visibleProductTypes[productTypeId] = !this.visibleProductTypes[productTypeId];
  }

  bankInfo = input.required<Bank>();
  productTypeService = inject(ProductTypeService);
  formCheckService = inject(FormCheckService);
  toastr = inject(ToastrService);
  productTypes: ProductType[] = [];

  ngOnInit(): void {
    this.bankInfo;
    this.getProductTypes();
  }
  
  getProductTypes(){
      const bankInfoId = this.bankInfo().id;
      this.productTypeService.getProductTypes(bankInfoId).subscribe(data => {
        if(!data) return; 
        this.productTypes = data.productTypes;
      });
  }

  deleteProductType(productTypeId: string, event: Event){
    const bankInfoId = this.bankInfo().id;
    if (!confirm('Confirm Deletion!')) {
      event.preventDefault();
      return;
    }
    this.productTypeService.deleteProductType(bankInfoId, productTypeId).subscribe({
      error: error => this.toastr.error(error),
      next: _ => {
        this.toastr.success("Successfully deleted product type");
        this.productTypes = this.productTypes.filter(productType => productType.productTypeId !== productTypeId);
      }
    });
  }
}
