import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BanksService } from '../../../_services/banks.service';
import { ProductTypeService } from '../../../_services/product-type.service';
import { Bank } from '../../../_models/bank';
import { ProductType } from '../../../_models/product-type';

@Component({
  selector: 'app-edit-product-type',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-product-type.component.html',
  styleUrl: './edit-product-type.component.scss'
})
export class EditProductTypeComponent implements OnInit {

  @ViewChild('editProductTypeForm') editProductTypeForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.editProductTypeForm?.dirty) {
      $event.returnValue = true;
    }
  }

  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  bankService = inject(BanksService);
  productTypeService = inject(ProductTypeService);
  bankInfos: Bank[] = [];
  bankInfo?: Bank;
  productType?: ProductType;

  ngOnInit(): void {
    this.loadBank();
    this.getProductType();
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!bankId) return;
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  getProductType(){
    let productTypeId = this.route.snapshot.paramMap.get("id");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    this.productTypeService.getProductTypes(bankId).subscribe( data => {
      this.productType = data.productTypes.find((product: ProductType) => product.productTypeId === productTypeId);
    })
  }

  editProductType(productTypeId: string) {
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if(bankId == null) return;
    this.productTypeService.updateProductType(this.editProductTypeForm?.value, bankId, productTypeId).subscribe({
      next: _ => {
        this.toastr.success( this.bankInfo?.bankName + " product type has been added successsfully");
        this.router.navigateByUrl('/banks/' + this.bankInfo?.id);
      },
      error: error => this.toastr.error("Not saved")
    })
  }
}
