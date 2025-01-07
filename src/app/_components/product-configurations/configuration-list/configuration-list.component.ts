import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ProductType } from '../../../_models/product-type';
import { ProductConfigurationService } from '../../../_services/product-configuration.service';
import { ToastrService } from 'ngx-toastr';
import { ProductConfiguration } from '../../../_models/product-configuration';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { ProductTypeService } from '../../../_services/product-type.service';
import { Bank } from '../../../_models/bank';
import { BanksService } from '../../../_services/banks.service';

@Component({
  selector: 'app-configuration-list',
  standalone: true,
  imports: [FormsModule, NgxEditorModule, RouterLink],
  templateUrl: './configuration-list.component.html',
  styleUrl: './configuration-list.component.scss'
})
export class ConfigurationListComponent implements OnInit {

  configurationData:string = ""
  route = inject(ActivatedRoute);
  productConfigurationService = inject(ProductConfigurationService);
  productTypeService = inject(ProductTypeService);
  bankService = inject(BanksService);
  productType?: ProductType;
  bankInfo?: Bank;
  toastr = inject(ToastrService);
  productConfigurations: ProductConfiguration[] = [];


  ngOnInit(): void {
    this.productType;
    this.getProductConfigurations();
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

  getProductConfigurations(){
    let productTypeId = this.route.snapshot.paramMap.get("productId");
      this.productConfigurationService.getProductConfigurations(productTypeId).subscribe(data => {
        if(!data) return;
        this.productConfigurations = data.productConfigurations;
      });
  }

  getProductType(){
    let productTypeId = this.route.snapshot.paramMap.get("productId");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    this.productTypeService.getProductTypes(bankId).subscribe( data => {
      this.productType = data.productTypes.find((product: ProductType) => product.productTypeId === productTypeId);
    })
  }

  getConfigurationData(id: string){
    this.configurationData = id;
  }

}
