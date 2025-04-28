import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PasswordModule } from 'primeng/password';
import { ProductConfiguration } from '../../../../../_models/product-configuration';
import { ProductConfigurationFeature } from '../../../_store/product-configurations/product-configuration.reducer';
import { config, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { getProductConfiguration } from '../../../_store/product-configurations/product-configurations.actions';
@Component({
  selector: 'app-product-configuration-form',
  templateUrl: './product-configuration-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    InputSwitchModule,
    PasswordModule,
  ],
})
export class ProductConfigurationFormComponent implements OnInit {
  constructor(private store: Store) {}

  @Input() productId: string = '';

  configTypes = [
    {
      label: 'Text',
      value: 'TextConfiguration',
    },
    {
      label: 'Excel',
      value: 'ExcelConfiguration',
    },
    {
      label: 'MDB',
      value: 'MdbConfiguration',
    },
  ];

  configurationType: string = 'MdbConfiguration';
  fileName: string = '';

  formGroup: FormGroup = new FormGroup({
    id: new FormControl(''),
    tableName: new FormControl(''),
    hasPassword: new FormControl(false),
    enableBarcode: new FormControl(false),
    isEncrypted: new FormControl(false),
    password: new FormControl(''),
    checkType: new FormControl(''),
    formType: new FormControl(''),
    deliverTo: new FormControl(''),
    quantity: new FormControl(''),
    brstn: new FormControl(''),
    accountNumber: new FormControl(''),
    accountName1: new FormControl(''),
    accountName2: new FormControl(''),
    startingSerialNumber: new FormControl(''),
    endingSerialNumber: new FormControl(''),
    concode: new FormControl(''),
    batch: new FormControl(''),
  });

  productConfiguration$: Observable<ProductConfiguration | undefined> =
    this.store.select(ProductConfigurationFeature.selectProductConfiguration);

  productConfig: ProductConfiguration | undefined;
  subscription$: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription$.add(
      this.productConfiguration$.subscribe((productConfiguration) => {
        if (productConfiguration) {
          this.productConfig = productConfiguration;

          var configData = JSON.parse(productConfiguration.configurationData);
          console.log(configData);

          configData.columnDefinition.forEach((columnDefinition: any) => {
            this.formGroup.patchValue({
              [columnDefinition.fieldName]: columnDefinition.columnName,
            });
          });

          var newVal = {
            ...this.formGroup.value,
            tableName: configData.tableName,
            hasPassword: Boolean(configData.hasPassword),
            enableBarcode: Boolean(configData.hasBarCode),
            isEncrypted: Boolean(configData.isEncrypted),
          }
          console.log(newVal);
          this.formGroup.patchValue(newVal);
          console.log(this.formGroup.value);
        }
      })
    );

    if (this.productId) {
      this.loadConfiguration();
    }
  }

  loadConfiguration() {
    this.store.dispatch(getProductConfiguration({ productId: this.productId }));
  }

  onSaveConfiguration() {
    console.log(this.formGroup.value);
  }

  onSubmit() {
    var request = this.buildRequest();
    console.log(request);
  }

  buildRequest(): any {
    if (this.configurationType === 'MdbConfiguration') {
      return {
        hasPassword: this.formGroup.get('hasPassword')?.value,
        password: this.formGroup.get('password')?.value,
        tableName: this.formGroup.get('tableName')?.value,
        enableBarcode: this.formGroup.get('enableBarcode')?.value,

        columnDefinitions: [
          {
            fieldName: 'checkType',
            columnName: this.formGroup.get('checkType')?.value,
          },
          {
            fieldName: 'formType',
            columnName: this.formGroup.get('formType')?.value,
          },
          {
            fieldName: 'deliverTo',
            columnName: this.formGroup.get('deliverTo')?.value,
          },
          {
            fieldName: 'quantity',
            columnName: this.formGroup.get('quantity')?.value,
          },
          {
            fieldName: 'brstn',
            columnName: this.formGroup.get('brstn')?.value,
          },
          {
            fieldName: 'batch',
            columnName: this.formGroup.get('batch')?.value,
          },
          {
            fieldName: 'startingSerialNo',
            columnName: this.formGroup.get('startingSerialNumber')?.value,
          },
          {
            fieldName: 'endingSerialNo',
            columnName: this.formGroup.get('endingSerialNumber')?.value,
          },
          {
            fieldName: 'accountNumber',
            columnName: this.formGroup.get('accountNumber')?.value,
          },
          {
            fieldName: 'concode',
            columnName: this.formGroup.get('concode')?.value,
          },
        ],
      };
    }
  }

  getColumnDefinition(columnDefinitions: any[], fieldName: string) {
    return columnDefinitions.find((x: any) => x.fieldName === fieldName).columnName;
  }
}
