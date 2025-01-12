import { Component, inject, Input, input, OnInit } from '@angular/core';
import { TagMapping } from '../../../_models/tag-mapping';
import { BranchService } from '../../../_services/branch.service';
import { FormCheckService } from '../../../_services/form-check.service';
import { ProductTypeService } from '../../../_services/product-type.service';
import { Bank } from '../../../_models/bank';
import { BankBranch } from '../../../_models/bank-branch';
import { ProductType } from '../../../_models/product-type';
import { TagMappingService } from '../../../_services/tag-mapping.service';
import { ToastrService } from 'ngx-toastr';
import { Tag } from '../../../_models/tag';
import { ActivatedRoute } from '@angular/router';
import { FormCheck } from '../../../_models/form-check';

@Component({
  selector: 'app-tag-mapping-list',
  standalone: true,
  imports: [],
  templateUrl: './tag-mapping-list.component.html',
  styleUrl: './tag-mapping-list.component.scss'
})
export class TagMappingListComponent implements OnInit{

  branchService = inject(BranchService);
  productServices = inject(ProductTypeService);
  formCheckService = inject(FormCheckService);
  route = inject(ActivatedRoute);
  mapping = input.required<TagMapping[]>();
  tagMappingService = inject(TagMappingService);
  toastr = inject(ToastrService);
  bankInfo = input.required<Bank>();
  tag = input.required<Tag>();
  branches: BankBranch[] = [];
  products: ProductType[] = [];
  formChecks: FormCheck[] = [];

  maps: TagMapping[] = [];
  branchLookup: { [key: string]: string } = {};
  productLookup: { [key: string]: string } = {};
  formCheckLookup: { [key: string]: string } = {};

  ngOnInit() {
    this.loadBranches();
    this.loadProducts();
    this.maps = this.mapping();
  }

  loadBranches(){
    this.branchService.getBranches(this.bankInfo().id).subscribe(data => {
      this.branches = data.branches;
      this.initializeLookups();
    })
  }

  loadProducts(){
    this.productServices.getProductTypes(this.bankInfo().id).subscribe(data => {
      this.products = data.productTypes;
      this.initializeLookups();
    })
  }

  initializeLookups() {
    this.branches.forEach(branch => {
      this.branchLookup[branch.id] = branch.branchName;

    });
    this.products.forEach(product => {
      this.productLookup[product.productTypeId] = product.productTypeName;
      this.onInnitializedChange(product.productTypeId);
    });

  }

  getBranchName(id: string): string {
    return this.branchLookup[id] || '';
  }

  getProductName(id: string): string {
    return this.productLookup[id] || '';
  }

  getFormCheckName(id: string): string {
    return this.formCheckLookup[id] || '';
  }

  deleteMapping(mapId: any, event: Event) {
    if (!confirm('Confirm Deletion!')) {
      event.preventDefault();
      return;
    }
    this.tagMappingService.deleteTagMapping(this.bankInfo().id, this.tag().id, mapId).subscribe({
      error: (error) => {
        this.toastr.error(error.error);
        console.log(error.error);
      },
      next: (response) => {
        this.toastr.success('Successfully deleted tag mapping from list.');
        this.maps = this.mapping().filter(map => map.id !== mapId);
      },
    });
  }

  onInnitializedChange(selectedProductId: any) {
    this.formCheckService.getFormChecks(selectedProductId).subscribe(data => {
      this.formChecks = data.formChecks;
      this.formChecks.forEach(formCheck => {
      this.formCheckLookup[formCheck.id] = formCheck.formType;
      });
    })
  }
}
