import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../../_models/product';
import { FormCheck } from '../../../_models/form-check';
import { ProductConfiguration } from '../../../_models/product-configuration';
import { ConfigurationType } from '../../../_models/constants';
import { FormCheckService } from '../../../_services/form-check.service';
import { ProductConfigurationService } from '../../../_services/product-configuration.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map } from 'rxjs/operators';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AddFormcheckComponent } from './components/add-formcheck/add-formcheck.component';
import { SharedFeature } from '../../../_store/shared/shared.reducer';
import { ProductsFeature } from '../_store/products/products.reducer';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterLink,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule,
  ],
  providers: [DialogService],

  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  componentName = 'ProductDetailComponent';
  product$: Observable<Product | undefined> = new Observable();
  bankId$: Observable<string | null> = new Observable();
  formChecks: FormCheck[] = [];
  productId: string = '';
  selectedConfigType: any = {};
  bankId: string | null = null;
  // Configuration form
  configuration: Partial<ProductConfiguration> = {
    fileName: '',
    configurationType: undefined,
    configurationData: '',
    productId: '',
  };

  // Dialog properties
  showAddFormCheckDialog: boolean = false;
  newFormCheck: Partial<FormCheck> = {
    checkType: '',
    formType: '',
    description: '',
    fileInitial: '',
    quanitity: 0,
    productId: '',
  };

  // Dropdown options
  checkTypes: string[] = ['Type 1', 'Type 2', 'Type 3'];
  formTypes: string[] = ['Form 1', 'Form 2', 'Form 3'];
  configTypes = [
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

  configJson: string = '';

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private formCheckService: FormCheckService,
    private configurationService: ProductConfigurationService,
    private toastr: ToastrService,
    private dialogService: DialogService
  ) {}
  ngOnDestroy(): void {
    console.log(`${this.componentName} destroyed`);
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.bankId$ = this.store.select(SharedFeature.selectSelectedBankInfoId);

    this.bankId$.subscribe((bankId) => {
      this.bankId = bankId;
    });

    // Get product from store
    this.product$ = this.store
      .select(ProductsFeature.selectProducts)
      .pipe(
        map((products) => products.find((p) => p.productId === this.productId))
      );

    // Load form checks and configuration
    this.loadFormChecks();
    this.loadConfiguration();
  }

  loadFormChecks() {
    this.bankId$.subscribe((bankId) => {
      if (bankId) {
        this.formCheckService
          .getFormCheckByProductId(bankId, this.productId)
          .subscribe({
            next: (data) => {
              if (data) {
                this.formChecks = data.formChecks;
              }
            },
            error: (error) => this.toastr.error('Error loading form checks'),
          });
      }
    });
  }

  loadConfiguration() {
    this.configurationService
      .getProductConfigurations(this.productId)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.configuration = data[0];
          } else {
            this.configuration = {
              fileName: '',
              configurationType: undefined,
              configurationData: '',
              productId: this.productId,
            };
          }
        },
        error: (error) => this.toastr.error('Error loading configuration'),
      });
  }

  saveConfiguration() {
    if (
      !this.configuration.fileName ||
      !this.configuration.configurationType ||
      !this.configuration.configurationData
    ) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    try {
      // Validate JSON format
      JSON.parse(this.configuration.configurationData);
    } catch (e) {
      this.toastr.error('Invalid JSON format');
      return;
    }

    if (this.bankId) {
      if (this.configuration.id) {
        // Update existing configuration
        this.configurationService
          .updateProductConfigurations(
            this.productId,
            this.bankId,
            this.configuration.id,
            this.configuration
          )
          .subscribe({
            next: () => {
              this.toastr.success('Configuration updated successfully');
              this.loadConfiguration();
            },
            error: (error) =>
              this.toastr.error('Error updating configuration'),
          });
      } else {
        // Create new configuration
        this.configurationService
          .addProductConfigurations(
            this.productId,
            this.bankId,
            this.configuration
          )
          .subscribe({
            next: () => {
              this.toastr.success('Configuration saved successfully');
              this.loadConfiguration();
            },
            error: (error) => this.toastr.error('Error saving configuration'),
          });
      }
    }
  }

  openAddFormCheckDialog() {
    this.dialogService.open(AddFormcheckComponent, {
      header: 'Add Form Check',
      width: '50%',
      height: '50%',
      closable: true,
      focusOnShow: true,
      closeOnEscape: true,
      data: {
        productId: this.productId,
      },
    });
  }

  saveFormCheck() {
    if (!this.newFormCheck.checkType || !this.newFormCheck.formType) {
      this.toastr.error('Please select both Check Type and Form Type');
      return;
    }

    if (this.bankId) {
      this.formCheckService
        .addFormCheck(this.newFormCheck as FormCheck, this.bankId)
        .subscribe({
          next: () => {
            this.toastr.success('Form check added successfully');
            this.showAddFormCheckDialog = false;
            this.loadFormChecks();
          },
          error: (error) => this.toastr.error('Error adding form check'),
        });
    }
  }

  deleteFormCheck(formCheckId: string, event: Event) {
    event.preventDefault();
    if (!confirm('Confirm Deletion!')) {
      return;
    }

    this.formCheckService
      .deleteFormCheck(this.productId, formCheckId)
      .subscribe({
        next: () => {
          this.toastr.success('Form check deleted successfully');
          this.loadFormChecks();
        },
        error: (error) => this.toastr.error('Error deleting form check'),
      });
  }

  autoFormatJson(value: string) {
    try {
      if (!value) {
        this.configJson = '';
        return;
      }

      // Try to parse the JSON
      const parsed = JSON.parse(value);
      
      // If successful, format it
      this.configJson = JSON.stringify(parsed, null, 2);
    } catch (error) {
      // If parsing fails, keep the original value
      this.configJson = value;
    }
  }

  formatJson() {
    try {
      if (!this.configJson) return;
      
      // Parse and re-stringify with proper formatting
      const parsedJson = JSON.parse(this.configJson);
      this.configJson = JSON.stringify(parsedJson, null, 2);
    } catch (error) {
      this.toastr.error('Invalid JSON format. Please check your input.', 'Error');
    }
  }
}
