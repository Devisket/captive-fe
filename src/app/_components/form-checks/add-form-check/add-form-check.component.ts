import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BanksService } from '../../../_services/banks.service';
import { ProductService } from '../../../_services/product.service';
import { Bank } from '../../../_models/bank';
import { Product } from '../../../_models/product';
import { FormCheckService } from '../../../_services/form-check.service';

@Component({
  selector: 'app-add-form-check',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './add-form-check.component.html',
  styleUrl: './add-form-check.component.scss'
})
export class AddFormCheckComponent {
  @ViewChild('addFormCheckForm') addFormCheckForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.addFormCheckForm?.dirty) {
      $event.returnValue = true;
    }
  }
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  bankService = inject(BanksService);
  productTypeService = inject(ProductService);
  formCheckService = inject(FormCheckService);
  bankInfos: Bank[] = [];
  bankInfo?: Bank;
  productType?: Product;
  model: any = {};
  productId:string = ""

  ngOnInit(): void {
    this.getProductType();
    this.loadBank();
  }
  
  loadBank() {
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!bankId) return;
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  getProductType(){
    this.productId = this.route.snapshot.paramMap.get("id") ?? '';
    let bankId = this.route.snapshot.paramMap.get("bankId");
    this.productTypeService.getAllProducts(bankId).subscribe( data => {
      this.productType = data.productTypes.find((product: Product) => product.productTypeId === this.productId);
    })
  }

  addFormCheck() {
    this.formCheckService.addFormCheck(this.addFormCheckForm?.value,this.productId).subscribe({
      next: _ => {
        this.toastr.success( this.bankInfo?.bankName + " product type has been added successsfully");
        this.router.navigateByUrl('/banks/' + this.bankInfo?.id);
      },
      error: error => this.toastr.error(error)
    })
  }
}
