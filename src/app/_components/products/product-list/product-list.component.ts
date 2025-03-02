import { Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ProductTypeService } from '../../../_services/product-type.service';
import { Product } from '../../../_models/product';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormCheckListComponent } from '../../form-checks/form-check-list/form-check-list.component';
import { FormsModule, NgForm } from '@angular/forms';
import { FormCheckService } from '../../../_services/form-check.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    FormsModule,
    NgFor,
    FormCheckListComponent,
    UpperCasePipe,
    TableModule,
    ButtonModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  visibleProductTypes: { [key: string]: boolean } = {};

  toggleFormCheckList(productTypeId: string): void {
    this.visibleProductTypes[productTypeId] =
      !this.visibleProductTypes[productTypeId];
  }

  bankInfo = input.required<Bank>();
  productTypeService = inject(ProductTypeService);
  formCheckService = inject(FormCheckService);
  toastr = inject(ToastrService);
  products: Product[] = [];

  ngOnInit(): void {
    this.bankInfo;
    this.getProducts();
  }

  getProducts() {
    const bankInfoId = this.bankInfo().id;
    this.productTypeService.getProductTypes(bankInfoId).subscribe((data) => {
      if (!data) return;
      this.products = data.productTypes;
    });
  }

  deleteProductType(productTypeId: string, event: Event) {
    const bankInfoId = this.bankInfo().id;
    if (!confirm('Confirm Deletion!')) {
      event.preventDefault();
      return;
    }
    this.productTypeService
      .deleteProductType(bankInfoId, productTypeId)
      .subscribe({
        error: (error) => this.toastr.error(error),
        next: (_) => {
          this.toastr.success('Successfully deleted product type');
          this.products = this.products.filter(
            (products) => products.productTypeId !== productTypeId
          );
        },
      });
  }
}
