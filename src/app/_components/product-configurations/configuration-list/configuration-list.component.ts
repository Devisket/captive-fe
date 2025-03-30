import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../_models/product';
import { ProductConfigurationService } from '../../../_services/product-configuration.service';
import { ToastrService } from 'ngx-toastr';
import { ProductConfiguration } from '../../../_models/product-configuration';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../_services/product.service';
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
  productTypeService = inject(ProductService);
  bankService = inject(BanksService);
  productType?: Product;
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
    let productId = this.route.snapshot.paramMap.get("productId");
      this.productConfigurationService.getProductConfigurations(productId).subscribe(data => {
        if(!data) return;
        this.productConfigurations = data.productConfigurations;
      });
  }

  getProductType(){
    let productId = this.route.snapshot.paramMap.get("productId");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    this.productTypeService.getAllProducts(bankId).subscribe( data => {
      this.productType = data.productTypes.find((product: Product) => product.productId === productId);
    })
  }

  getConfigurationData(id: string){
    this.configurationData = id;
  }

}
