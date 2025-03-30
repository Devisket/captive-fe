import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BanksService } from '../../../_services/banks.service';
import { ProductService } from '../../../_services/product.service';
import { Bank } from '../../../_models/bank';
import { Product } from '../../../_models/product';
import { Editor, NgxEditorModule } from 'ngx-editor';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductConfigurationService } from '../../../_services/product-configuration.service';
import { ProductConfiguration } from '../../../_models/product-configuration';
import { InputTextModule } from 'primeng/inputtext';
import { ConfigurationType } from '../../../_models/constants';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-view-configuration',
  standalone: true,
  imports: [
    FormsModule,
    NgxEditorModule,
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    SelectButtonModule,
  ],
  templateUrl: './view-configuration.component.html',
  styleUrl: './view-configuration.component.scss',
})
export class ViewConfigurationComponent implements OnInit, OnDestroy {
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  bankService = inject(BanksService);
  productTypeService = inject(ProductService);
  configurationService = inject(ProductConfigurationService);
  productType?: Product;
  productConfiguration?: ProductConfiguration;
  bankInfos: Bank[] = [];
  bankInfo?: Bank;
  editor: Editor = new Editor();
  jsonDoc: any;
  model: any = {};
  isExists = false;
  isEditable = false;
  formGroup: FormGroup = new FormGroup({
    fileName: new FormControl(),
    configurationData: new FormControl(),
    configurationType: new FormControl(),
  });

  configurationTypes = [
    {
      label: 'Text',
      value: ConfigurationType.TextConfiguration,
    },
    {
      label: 'Excel',
      value: ConfigurationType.ExcelConfiguration,
    },
    {
      label: 'MDB',
      value: ConfigurationType.MdbConfiguration,
    },
  ];

  ngOnInit(): void {
    this.loadBank();
    this.getProductType();
    this.getProductConfiguration();
  }

  private loadBank() {
    let bankId = this.route.snapshot.paramMap.get('bankId');
    if (!bankId) return;
    this.bankService.getBanks().subscribe((data) => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  private getProductType() {
    this.formGroup.disable();
    let productId = this.route.snapshot.paramMap.get('productId');
    let bankId = this.route.snapshot.paramMap.get('bankId');
    this.productTypeService.getAllProducts(bankId!).subscribe((data) => {
      this.productType = data.productTypes.find(
        (product: Product) => product.productId === productId
      );
    });
  }

  private getProductConfiguration() {
    let productId = this.route.snapshot.paramMap.get('productId');
    this.configurationService
      .getProductConfigurations(productId)
      .subscribe((data) => {
        this.productConfiguration = data.productConfiguration;

        if (!this.productConfiguration) return;

        const jsonString = this.productConfiguration?.configurationData;

        this.jsonDoc = this.formatJson(jsonString);

        this.getfileNameControl().setValue(this.productConfiguration?.fileName);

        this.getConfigurationTypeControl().setValue(
          this.productConfiguration?.configurationType
        );

        this.getJsonConfigurationControl().setValue(this.jsonDoc);

        console.log(this.productConfiguration); 
      });
  }

  private formatJson(jsonString: string): string {
    try {
      const jsonObject = JSON.parse(jsonString);
      return JSON.stringify(jsonObject, null, 2); // 2 spaces for indentation
    } catch (error) {
      console.error('Invalid JSON string', error);
      return jsonString; // Return original string if invalid JSON
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  editProductConfiguration() {
    //
  }

  enableEditConfiguration(isTrue: boolean) {
    this.formGroup.enable();
  }

  cancelEditConfiguration() {
    this.formGroup.disable();
    const jsonData = this.productConfiguration!.configurationData;
    this.formGroup.reset({
      fileName: this.productConfiguration?.fileName,
      configurationData: this.formatJson(jsonData),
    });
  }

  getJsonConfigurationControl(): FormControl {
    return this.formGroup?.get('configurationData') as FormControl;
  }

  getfileNameControl(): FormControl {
    return this.formGroup?.get('fileName') as FormControl;
  }

  getConfigurationTypeControl(): FormControl {
    return this.formGroup?.get('configurationType') as FormControl;
  }

  onSubmitChanges() {
    if (this.formGroup.valid) {
      const request = {
        fileName: this.getfileNameControl().value,
        configurationData: this.getJsonConfigurationControl().value,
      };

      if (this.productConfiguration) {
        this.configurationService
          .updateProductConfigurations(
            this.productConfiguration.productId,
            this.bankInfo!.id,
            this.productConfiguration.id,
            request
          )
          .subscribe((data) => {
            console.log(data);
          });
      }
    }
  }
}
