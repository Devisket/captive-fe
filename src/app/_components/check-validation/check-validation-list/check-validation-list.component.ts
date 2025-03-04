import { Component, inject, input, OnInit } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { CheckValidation } from '../../../_models/check-validation';
import { CheckValidationService } from '../../../_services/check-validation.service';
import { EnumsService } from '../../../_services/enums.service';
import { TableModule } from 'primeng/table';
import { ProductService } from '../../../_services/product.service';
import { BanksService } from '../../../_services/banks.service';
import { BranchService } from '../../../_services/branch.service';
import { FormCheckService } from '../../../_services/form-check.service';
import { Product } from '../../../_models/product';
import { FormCheck } from '../../../_models/form-check';
import { BankBranch } from '../../../_models/bank-branch';
import { Tag } from '../../../_models/tag';

@Component({
  selector: 'app-check-validation-list',
  standalone: true,
  imports: [TableModule],
  templateUrl: './check-validation-list.component.html',
  styleUrl: './check-validation-list.component.scss'
})
export class CheckValidationListComponent implements OnInit{
  bankInfo = input.required<Bank>();
  checkValidations: CheckValidation[] = [];
  checkValidationService = inject(CheckValidationService);
  enums = inject(EnumsService);
  productService = inject(ProductService);
  bankService = inject(BanksService)
  branchService = inject(BranchService)
  formCheckService = inject(FormCheckService)
  
  validationTypes: any = [];

  products: Product[] = [];
  branches: BankBranch[] = [];
  formChecks: FormCheck[] = [];
  tagMappings: Tag[] = [];

  ngOnInit(): void {
    this.initialize();
  }

  async initialize(){
    await this.getAllTagAndMapping();
  }

  loadProducts(){
    this.productService.getAllProducts(this.bankInfo().id).subscribe({
      next: (res) => {
        this.products = res.productTypes;
      }
    });
  }

  loadBranches(){
    this.branchService.getBranches(this.bankInfo().id).subscribe({
      next: (res) => {
        this.branches = res;
      }
    });
  }

  loadFormChecks(){
    this.formCheckService.getAllFormChecks(this.bankInfo().id).subscribe({
      next: (res) => {
        this.formChecks = res;
      }
    });
  }


  getAllTagAndMapping(){
    this.checkValidationService.getAllTagAndMapping(this.bankInfo().id).subscribe({
      next: async (res) => {

        this.tagMappings = res;

        await this.loadProducts();
        await this.loadBranches();
        await this.loadFormChecks();



        this.tagMappings.map((tag)=>{

          tag.mapping.map((mapping)=>{
            mapping.formCheckName = this.formChecks.find((formCheck)=>formCheck.id === mapping.formCheckId)?.checkType ?? '';
            mapping.productName = this.products.find((product)=>product.id === mapping.productId)?.productTypeName ?? '';
            mapping.branchName = this.branches.find((branch)=>branch.id === mapping.branchId)?.branchName ?? '';
          })
        })

        console.log(this.tagMappings);
      }
    });
  }
}
