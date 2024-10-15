import { Component, inject, Input, input, OnInit } from '@angular/core';
import { TagMapping } from '../../../_models/tag-mapping';
import { BranchService } from '../../../_services/branch.service';
import { FormCheckService } from '../../../_services/form-check.service';
import { ProductTypeService } from '../../../_services/product-type.service';
import { Bank } from '../../../_models/bank';
import { BankBranch } from '../../../_models/bank-branch';
import { ProductType } from '../../../_models/product-type';

@Component({
  selector: 'app-tag-mapping-list',
  standalone: true,
  imports: [],
  templateUrl: './tag-mapping-list.component.html',
  styleUrl: './tag-mapping-list.component.css'
})
export class TagMappingListComponent {

  // @Input() mapping: TagMapping[];
  branchService = inject(BranchService);
  productService = inject(ProductTypeService);
  formCheckService = inject(FormCheckService);
  mapping = input.required<TagMapping[]>();
  bankInfo = input.required<Bank>();
  tagMappings: any = [];
  branch?: BankBranch;
  product?: ProductType;
  maps: any = [];


  // loadData(){

  //   this.mapping().forEach(map => {
  //     this.maps = [];
  //     if(map.branchId){
  //       let branchId = map.branchId;
  //       this.branchService.getBranch(this.bankInfo().id, branchId).subscribe(data => {
  //         let branch = data.branches.find((x: BankBranch) => x.id === branchId);
  //         this.maps.push({"branch": branch});
  //       })
  //     }

  //     if(map.productId){
  //       let productId = map.productId;
  //       this.productService.getProductTypes(this.bankInfo().id).subscribe(data => {
  //         let product = data.productTypes.find((x: ProductType) => x.productTypeId === productId);
  //         this.maps.push({"product": product});
  //       })
  //     }
  //     this.tagMappings.push(this.maps);
  //   });
  // }
  // // this.tagMappings.push(map.formCheckId);

}
