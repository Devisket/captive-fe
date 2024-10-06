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
  bankInfos: Bank[] = [];
  bankInfo?: Bank;
  productType?: ProductType;
  editor: Editor  = new Editor();
  jsonDoc: any;
  model: any = {
    // fileName: 'Config Data 1',
    // htmlString: `{"hasPassword":1,"hasBarcode":1,"tableName":"ChkBook","columnDefinition":[{"fieldName":"checkType","columnName":"ChkType"},{"fieldName":"brstn","columnName":"RTNO"},{"fieldName":"accountNumber","columnName":"AcctNo"},{"fieldName":"Account","columnName":"ChkType"},{"fieldName":"accountName1","columnName":"AcctNm1"},{"fieldName":"accountName2","columnName":"AcctNm2"},{"fieldName":"concode","columnName":"ContCode"},{"fieldName":"quantity","columnName":"OrderQty"},{"fieldName":"formType","columnName":"FormType"},{"fieldName":"batch","columnName":"batch"}]}`
    // // htmlString: ''
  };

  ngOnInit(): void {
    this.loadBank();
    this.getProductType();

    // const jsonObject = JSON.parse(this.model.htmlString);
    // const jsonString = JSON.stringify(jsonObject, null, 2);

    // this.jsonDoc = {
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

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  addProductConfiguration(){
    //
  }
}
