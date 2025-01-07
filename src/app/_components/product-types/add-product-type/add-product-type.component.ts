import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductTypeService } from '../../../_services/product-type.service';
import { UpperCasePipe } from '@angular/common';
import { ProductConfigurationService } from '../../../_services/product-configuration.service';

@Component({
  selector: 'app-add-product-type',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, RouterLink],
  templateUrl: './add-product-type.component.html',
  styleUrl: './add-product-type.component.scss'
})
export class AddProductTypeComponent implements OnInit{

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
  productTypeService = inject(ProductTypeService);
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
