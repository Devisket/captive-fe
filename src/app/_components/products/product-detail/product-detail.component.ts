import { Component, OnInit, inject } from '@angular/core';
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
import { getSelectedBankInfoId } from '../../../_store/shared/shared.selectors';
import { map } from 'rxjs/operators';
import { getAllStateProducts } from '../_store/products/products.selector';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AddFormcheckComponent } from './components/add-formcheck/add-formcheck.component';

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
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product | undefined> = new Observable();
  bankId$: Observable<string | null> = new Observable();
  formChecks: FormCheck[] = [];
  productId: string = '';
  selectedConfigType: any = {};
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

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private formCheckService: FormCheckService,
    private configurationService: ProductConfigurationService,
    private toastr: ToastrService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.bankId$ = this.store.select(getSelectedBankInfoId);

    // Get product from store
    this.product$ = this.store
      .select(getAllStateProducts)
      .pipe(
        map((products) => products.find((p) => p.productId === this.productId))
      );

    // Load form checks and configuration
    this.loadFormChecks();
    this.loadConfiguration();
  }

  loadFormChecks() {
    this.bankId$ = this.store.select(getSelectedBankInfoId);
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

    this.bankId$ = this.store.select(getSelectedBankInfoId);
    this.bankId$.subscribe((bankId) => {
      if (bankId) {
        if (this.configuration.id) {
          // Update existing configuration
          this.configurationService
            .updateProductConfigurations(
              this.productId,
              bankId,
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
              bankId,
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
    });
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

    this.bankId$ = this.store.select(getSelectedBankInfoId);
    this.bankId$.subscribe((bankId) => {
      if (bankId) {
        this.formCheckService
          .addFormCheck(this.newFormCheck as FormCheck, bankId)
          .subscribe({
            next: () => {
              this.toastr.success('Form check added successfully');
              this.showAddFormCheckDialog = false;
              this.loadFormChecks();
            },
            error: (error) => this.toastr.error('Error adding form check'),
          });
      }
    });
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
}
