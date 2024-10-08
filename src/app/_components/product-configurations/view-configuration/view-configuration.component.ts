import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BanksService } from '../../../_services/banks.service';
import { ProductTypeService } from '../../../_services/product-type.service';
import { Bank } from '../../../_models/bank';
import { ProductType } from '../../../_models/product-type';
import { ConfigurationListComponent } from '../configuration-list/configuration-list.component';
import { NgIf } from '@angular/common';
import { EditConfigurationComponent } from '../edit-configuration/edit-configuration.component';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { ProductConfigurationService } from '../../../_services/product-configuration.service';
import { ProductConfiguration } from '../../../_models/product-configuration';

@Component({
  selector: 'app-view-configuration',
  standalone: true,
  imports: [ConfigurationListComponent, NgIf, EditConfigurationComponent, FormsModule, NgxEditorModule, RouterLink],
  templateUrl: './view-configuration.component.html',
  styleUrl: './view-configuration.component.css'
})
export class ViewConfigurationComponent implements OnInit, OnDestroy{
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  bankService = inject(BanksService);
  productTypeService = inject(ProductTypeService);
  configurationService = inject(ProductConfigurationService);
  productType?: ProductType;
  productConfiguration?: ProductConfiguration;
  bankInfos: Bank[] = [];
  bankInfo?: Bank;
  editor: Editor  = new Editor();
  jsonDoc: any;
  model: any = {};

  ngOnInit(): void {
    this.loadBank();
    this.getProductType();
    this.getProductConfiguration();
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!bankId) return;
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  getProductType(){
    let productTypeId = this.route.snapshot.paramMap.get("productId");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    this.productTypeService.getProductTypes(bankId).subscribe( data => {
      this.productType = data.productTypes.find((product: ProductType) => product.productTypeId === productTypeId);
    })
  }

  getProductConfiguration(){
    let productTypeId = this.route.snapshot.paramMap.get("productId");
    let configurationId = this.route.snapshot.paramMap.get("configurationId");
    this.configurationService.getProductConfigurations(productTypeId).subscribe( data => {
      this.productConfiguration = data.productConfigurations.find((productConfig: ProductConfiguration) => productConfig.id === configurationId);
      if(!this.productConfiguration) return;
      this.jsonDoc = JSON.parse(this.productConfiguration?.configurationData);
    })
  }


      // this.jsonDoc = JSON.parse(this.productConfiguration?.configurationData);
      // const jsonDocument = {
      //   type: 'doc',
      //   content: [
      //     {
      //       type: 'paragraph',
      //       content: [
      //         {
      //           type: 'text',
      //           text: jsonString
      //         }
      //       ]
      //     }
      //   ]
      // };

      // const textContent = jsonDocument.content[0].content[0].text;
      // this.jsonDoc = JSON.parse(textContent);

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  editProductConfiguration(){
    //
  }
}
