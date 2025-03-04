import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../_services/product.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit{

  @ViewChild('addProductTypeForm') addProductTypeForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.addProductTypeForm?.dirty) {
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
  model: any = {};

  ngOnInit(): void {
    this.loadBank()
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get('id');
    if (!bankId) return;
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  addProductType() {
    this.productTypeService.addProductType(this.addProductTypeForm?.value, this.bankInfo?.id).subscribe({
      next: _ => {
        this.toastr.success( this.bankInfo?.bankName + " product type has been added successsfully");
        this.router.navigateByUrl('/banks/' + this.bankInfo?.id);
      },
      error: error => this.toastr.error("Not saved")
    })
  }
}
