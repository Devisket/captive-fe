import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../../_models/product';
import { FormCheck } from '../../../_models/form-check';
import { ProductConfiguration } from '../../../_models/product-configuration';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map, tap } from 'rxjs/operators';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AddFormcheckComponent } from './components/add-formcheck/add-formcheck.component';
import { SharedFeature } from '../../../_store/shared/shared.reducer';
import { ProductsFeature } from '../_store/products/products.reducer';
import { FormChecksFeature } from '../_store/formchecks/formchecks.reducer';
import {
  deleteFormCheck,
  getAllFormChecks,
} from '../_store/formchecks/formchecks.action';
import { ProductConfigurationFeature } from '../_store/product-configurations/product-configuration.reducer';
import {
  createProductConfiguration,
  getProductConfiguration,
  updateProductConfiguration,
} from '../_store/product-configurations/product-configurations.actions';
import { ProductConfigurationFormComponent } from './components/product-configuration-form/product-configuration-form.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    AsyncPipe,
    ProductConfigurationFormComponent,
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
  bankId: string | null = null;

  productConfigurationForm: FormGroup = new FormGroup({
    id: new FormControl(undefined, []),
    fileName: new FormControl('', []),
    configurationType: new FormControl('', []),
    configurationData: new FormControl('', []),
  });

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

  configJson: string = '';
  subscription$: Subscription = new Subscription();
  formChecks$: Observable<FormCheck[]> = this.store.select(
    FormChecksFeature.selectFormChecks
  );
  productConfiguration$: Observable<ProductConfiguration | undefined> =
    this.store.select(ProductConfigurationFeature.selectProductConfiguration);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.bankId$ = this.store.select(SharedFeature.selectSelectedBankInfoId);

    this.subscription$.add(
      this.formChecks$.subscribe((formChecks) => {
        this.formChecks = formChecks;
      })
    );

    this.bankId$.subscribe((bankId) => {
      this.bankId = bankId;
    });

    // Get product from store
    this.product$ = this.store
      .select(ProductsFeature.selectProducts)
      .pipe(
        map((products) => products.find((p) => p.productId === this.productId))
      );

    this.loadFormChecks();
  }

  loadFormChecks() {
    this.store.dispatch(getAllFormChecks({ productId: this.productId }));
  }

  onSaveConfiguration() {
    this.productConfigurationForm.markAllAsTouched();
    if (this.productConfigurationForm.valid) {
      if (this.productConfigurationForm.value.id) {
        this.store.dispatch(
          updateProductConfiguration({
            productId: this.productId,
            configuration: this.productConfigurationForm.value,
          })
        );
      } else {
        this.store.dispatch(
          createProductConfiguration({
            productId: this.productId,
            configuration: this.productConfigurationForm.value,
          })
        );
      }
    }
  }

  openAddFormCheckDialog(formCheck?: FormCheck) {
    this.dialogService.open(AddFormcheckComponent, {
      header: formCheck ? 'Update Form Check' : 'Add Form Check',
      width: '500px',
      closable: true,
      focusOnShow: true,
      closeOnEscape: true,
      style: {
        'max-height': '500px',
        'min-width': '500px',
        overflow: 'auto',
        padding: '0px',
      },
      data: {
        productId: this.productId,
        formCheck: formCheck,
      },
    });
  }

  deleteFormCheck(formCheckId: string, event: Event) {
    event.preventDefault();
    if (!confirm('Confirm Deletion!')) {
      return;
    }

    this.store.dispatch(
      deleteFormCheck({ productId: this.productId, formCheckId: formCheckId })
    );
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
      this.toastr.error(
        'Invalid JSON format. Please check your input.',
        'Error'
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
