import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ProductType } from '../../../_models/product-type';
import { ProductConfigurationService } from '../../../_services/product-configuration.service';
import { ToastrService } from 'ngx-toastr';
import { ProductConfiguration } from '../../../_models/product-configuration';
import { ActivatedRoute } from '@angular/router';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuration-list',
  standalone: true,
  imports: [FormsModule, NgxEditorModule],
  templateUrl: './configuration-list.component.html',
  styleUrl: './configuration-list.component.css'
})
export class ConfigurationListComponent implements OnInit, OnDestroy{

  productType = input.required<ProductType>();
  configurationData:string = ""
  route = inject(ActivatedRoute);
  productConfigurationService = inject(ProductConfigurationService);
  toastr = inject(ToastrService);
  productConfigurations: ProductConfiguration[] = [];
  editor: Editor  = new Editor();
  jsonDoc: any;
  model: any = {};

  ngOnInit(): void {
    this.productType;
    this.getProductConfigurations();
    this.model;
    this.convertToJson();
  }

  convertToJson(){
    const htmlString = this.model.configurationData;
    if(!htmlString) return "none";
    const jsonObject = JSON.parse(htmlString);
    const jsonString = JSON.stringify(jsonObject, null, 2);

    return this.jsonDoc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: jsonString
            }
          ]
        }
      ]
    };
  }

  getProductConfigurations(){
    let productTypeId = this.route.snapshot.paramMap.get("productId");
      this.productConfigurationService.getProductConfigurations(productTypeId).subscribe(data => {
        if(!data) return;
        this.productConfigurations = data.productConfigurations;
        this.model = data.productConfigurations[0];
      });
  }

  getConfigurationData(id: string){
    this.configurationData = id;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  editProductConfiguration(){
    //
  }

}
