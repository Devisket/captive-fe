import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TagsService } from '../../../_services/tags.service';
import { BanksService } from '../../../_services/banks.service';
import { CheckValidationService } from '../../../_services/check-validation.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterEvent, RouterLink } from '@angular/router';
import { Bank } from '../../../_models/bank';
import { Tag } from '../../../_models/tag';
import { TagMappingService } from '../../../_services/tag-mapping.service';
import { BranchService } from '../../../_services/branch.service';
import { BankBranch } from '../../../_models/bank-branch';
import { ProductType } from '../../../_models/product-type';
import { FormCheck } from '../../../_models/form-check';
import { FormCheckService } from '../../../_services/form-check.service';
import { ProductTypeService } from '../../../_services/product-type.service';

@Component({
  selector: 'app-add-tag-mapping',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './add-tag-mapping.component.html',
  styleUrl: './add-tag-mapping.component.css'
})
export class AddTagMappingComponent {

  @ViewChild('addTagMappingForm') addTagMappingForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.addTagMappingForm?.dirty) {
      $event.returnValue = true;
    }
  }

  tagServices = inject(TagsService);
  tagMappingServices = inject(TagMappingService);
  branchService = inject(BranchService);
  formCheckServices = inject(FormCheckService);
  productServices = inject(ProductTypeService);
  bankService = inject(BanksService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router)
  bankInfo?: Bank;
  tag?: Tag;
  model: any = {};
  checkValidationId = this.route.snapshot.paramMap.get("checkValidationId");
  bankId = this.route.snapshot.paramMap.get("bankId");
  mappings: any = [];

  branches: BankBranch[] = [];
  formChecks: FormCheck[] = [];
  products: ProductType[] = [];

  ngOnInit(): void {
    this.loadBank();
    this.loadTag();
    this.loadBranches();
    this.loadProducts();
  }

  loadBank() {
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === this.bankId);
    });
  }

  loadBranches(){
    this.branchService.getBranches(this.bankId).subscribe(data => {
      this.branches = data.branches;
    })
  }

  loadProducts(){
    this.productServices.getProductTypes(this.bankId).subscribe(data => {
      this.products = data.productTypes;
    })
  }

  loadTag() {
    let tagId = this.route.snapshot.paramMap.get("tagId");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!tagId || !bankId) return;
    this.tagServices.getTag(bankId, tagId).subscribe(data => {
      this.tag = data;
    });
  }


  addTagMapping() {
    const requestBody = this.createRequestBody(this.model);
    console.log(requestBody)
    this.tagMappingServices.addTagMapping(this.bankInfo?.id, this.tag?.id, requestBody).subscribe({
      next: _ => {
        this.toastr.success("New tag mapping has been added successsfully");
      },
      error: error => this.toastr.error(error),
      complete: () => this.router.navigateByUrl('/tag-list/' + this.checkValidationId + '/bank/' + this.bankInfo?.id)
    })
  }

  createRequestBody(formData: any) {
    return {
      mappings: [
        {
          branchId: formData.branchId || null,
          productId: formData.productId || null,
          formCheckId: formData.formCheckId || null
        }
      ]
    };
  }

  onProductChange(event: any) {
    const selectedProductId = event.target.value;
    this.model.formCheckId = '';
    if(selectedProductId){
      this.formCheckServices.getFormChecks(selectedProductId, this.bankId).subscribe(data => {
        this.formChecks = data.bankFormChecks;
      })
    }else{
      this.formChecks = [];
    }

  }
}
