import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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
import {
  createProductConfiguration,
  getProductConfiguration,
  updateProductConfiguration,
  resetProductConfiguration,
} from '../../../_store/product-configurations/product-configurations.actions';
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
export class ProductConfigurationFormComponent implements OnInit, OnDestroy {
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
    {
      label: 'DBF',
      value: 'DbfConfiguration',
    }
  ];

  configurationType: string = 'MdbConfiguration';
  fileName: string = '';
  isChangeFileType: boolean = false;
  fileType: string = '';

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
    if (this.productId) {
      console.log('loadConfiguration', this.productId);
      this.loadConfiguration(this.productId);
    }
  }

  loadConfiguration(productId: string) {
    this.store.dispatch(getProductConfiguration({ productId: productId }));

    this.subscription$.add(
      this.productConfiguration$.subscribe((productConfiguration) => {
        if (productConfiguration) {

          this.productConfig = productConfiguration;

          const configurationData = JSON.parse(
            this.productConfig.configurationData
          );

          console.log('configurationData', configurationData);

          configurationData.columnDefinitions.forEach(
            (columnDefinition: any) => {
              this.formGroup.patchValue({
                [columnDefinition.fieldName]: columnDefinition.columnName,
              });
            }
          );

          this.fileName = productConfiguration.fileName;
          this.configurationType = productConfiguration.configurationType;
          this.isChangeFileType = productConfiguration.isChangeFileType;
          this.fileType = productConfiguration.fileType;

          const val = {
            ...this.formGroup.value,
            id: this.productConfig?.id,
            tableName: configurationData.tableName,
            hasPassword: Boolean(configurationData.hasPassword),
            password: configurationData.password,
            enableBarcode: Boolean(configurationData.hasBarCode),
            isEncrypted: Boolean(configurationData.isEncrypted),
          };

          this.formGroup.patchValue(val);
        }
      })
    );
  }

  onSaveConfiguration() {
    const columnDefinitions = JSON.stringify(this.buildRequest());

    const request = {
      ...this.productConfig!,
      fileName: this.fileName,
      configurationType: this.configurationType,
      configurationData: columnDefinitions,
      fileType: this.fileType,
      isChangeFileType: this.isChangeFileType,

    };

    if (this.productConfig?.id) {
      this.store.dispatch(
        updateProductConfiguration({
          productId: this.productId,
          configuration: request,
        })
      );
    } else {
      this.store.dispatch(
        createProductConfiguration({
          productId: this.productId,
          configuration: request,
        })
      );
    }
    console.log(request);
  }

  buildRequest(): any {
    if (this.configurationType === 'MdbConfiguration' || this.configurationType === 'DbfConfiguration') {
      return {
        hasPassword: this.formGroup.get('hasPassword')?.value,
        password: this.formGroup.get('password')?.value,
        tableName: this.formGroup.get('tableName')?.value,
        enableBarcode: this.formGroup.get('enableBarcode')?.value,
        isEncrypted: this.formGroup.get('isEncrypted')?.value,
       
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
            fieldName: 'startingSerialNumber',
            columnName: this.formGroup.get('startingSerialNumber')?.value,
          },
          {
            fieldName: 'endingSerialNumber',
            columnName: this.formGroup.get('endingSerialNumber')?.value,
          },
          {
            fieldName: 'accountNumber',
            columnName: this.formGroup.get('accountNumber')?.value,
          },
          {
            fieldName: 'accountName1',
            columnName: this.formGroup.get('accountName1')?.value,
          },
          {
            fieldName: 'accountName2',
            columnName: this.formGroup.get('accountName2')?.value,
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
    return columnDefinitions.find((x: any) => x.fieldName === fieldName)
      .columnName;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
    this.resetForm();
  }

  resetForm() {
    this.fileName = '';
    this.configurationType = '';
    this.store.dispatch(resetProductConfiguration());
    this.formGroup.setValue({
      id: '',
      tableName: '',
      hasPassword: false,
      enableBarcode: false,
      isEncrypted: false,
      password: '',
      checkType: '',
      formType: '',
      deliverTo: '',
      quantity: '',
      brstn: '',
      accountNumber: '',
      accountName1: '',
      accountName2: '',
      startingSerialNumber: '',
      endingSerialNumber: '',
      concode: '',
      batch: '',
    });
  }
}
