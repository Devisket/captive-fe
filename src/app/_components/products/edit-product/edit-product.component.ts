import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BanksService } from '../../../_services/banks.service';
import { ProductService } from '../../../_services/product.service';
import { Bank } from '../../../_models/bank';
import { Product } from '../../../_models/product';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {

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
  productTypeService = inject(ProductService);
  bankInfos: Bank[] = [];
  bankInfo?: Bank;
  productType?: Product;

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
    let productId = this.route.snapshot.paramMap.get("id");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    this.productTypeService.getAllProducts(bankId!).subscribe( data => {
      this.productType = data.productTypes.find((product: Product) => product.productId === productId);
    })
  }

  editProductType(productId: string) {
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if(bankId == null) return;
    this.productTypeService.updateProductType(this.editProductTypeForm?.value, bankId, productId).subscribe({
      next: _ => {
        this.toastr.success( this.bankInfo?.bankName + " product type has been added successsfully");
        this.router.navigateByUrl('/banks/' + this.bankInfo?.id);
      },
      error: error => this.toastr.error("Not saved")
    })
  }
}
