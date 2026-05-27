import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CheckInventory } from '../../../../../_models/check-inventory';
import { BankValues } from '../../../../../_models/values/bankValues';
import { ValuesDto } from '../../../../../_models/values/valuesDto';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { addNewCheckInventory, updateCheckInventory } from '../../../../store/tag/tag.actions';
import { SharedFeature } from '../../../../../shared/_store/shared.reducer';

@Component({
  selector: 'app-add-check-inventory',
  templateUrl: './add-check-inventory.component.html',
  styleUrls: ['./add-check-inventory.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    CommonModule,
  ],
})
export class AddCheckInventoryComponent implements OnInit, OnDestroy {
  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private store: Store
  ) {}

  bankId: string = '';
  bankValues: BankValues | undefined;
  subscription$ = new Subscription();

  formCheckOptions: ValuesDto[] = [
    { id: 'Personal', value: 'Personal' },
    { id: 'Commercial', value: 'Commercial' },
  ];

  formGroup = new FormGroup(
    {
      id: new FormControl(''),
      branchIds: new FormControl<string[]>([]),
      productIds: new FormControl<string[]>([]),
      formCheckType: new FormControl<string[]>([]),
      accountNumber: new FormControl(''),
      seriesPattern: new FormControl(''),
      warningSeries: new FormControl(0, [Validators.required]),
      numberOfPadding: new FormControl(0, [Validators.required, Validators.min(1)]),
      startingSeries: new FormControl(0, [Validators.required]),
      endingSeries: new FormControl(0, [Validators.required]),
      isRepeating: new FormControl(false),
    },
    {
      validators: [
        (control: AbstractControl): ValidationErrors | null => {
          const form = control as FormGroup;
          const start = form.get('startingSeries')?.value;
          const end = form.get('endingSeries')?.value;
          return start > end ? { startGreaterThanEnd: true } : null;
        },
        (control: AbstractControl): ValidationErrors | null => {
          const form = control as FormGroup;
          const warning = form.get('warningSeries')?.value;
          const start = form.get('startingSeries')?.value;
          const end = form.get('endingSeries')?.value;
          if (warning < start) return { warningLessThanStart: true };
          if (warning >= end) return { warningGreaterThanOrEqualEnd: true };
          return null;
        },
      ],
    }
  );

  ngOnInit(): void {
    this.bankId = this.dialogConfig.data.bankId;

    this.subscription$.add(
      this.store.select(SharedFeature.selectBankValues).subscribe((bankValues) => {
        this.bankValues = bankValues ?? undefined;
      })
    );

    this.formGroup.get('seriesPattern')?.valueChanges.subscribe((value) => {
      if (value) {
        const upper = value.toUpperCase();
        if (value !== upper) this.formGroup.patchValue({ seriesPattern: upper }, { emitEvent: false });
      }
    });

    if (this.dialogConfig.data.checkInventory) {
      const inv: CheckInventory = this.dialogConfig.data.checkInventory;
      this.formGroup.patchValue({
        id: inv.id ?? '',
        branchIds: inv.mappingData?.branchIds ?? [],
        productIds: inv.mappingData?.productIds ?? [],
        formCheckType: inv.mappingData?.formCheckType ?? [],
        accountNumber: inv.accountNumber ?? '',
        seriesPattern: inv.seriesPattern,
        warningSeries: inv.warningSeries,
        numberOfPadding: inv.numberOfPadding,
        startingSeries: inv.startingSeries,
        endingSeries: inv.endingSeries,
        isRepeating: inv.isRepeating,
      });
    }
  }

  onSubmit() {
    if (!this.formGroup.valid) return;

    const val = this.formGroup.value;
    const checkInventory: CheckInventory = {
      id: val.id || undefined,
      bankId: this.bankId,
      currentSeries: 0,
      isActive: true,
      seriesPattern: val.seriesPattern || '',
      warningSeries: val.warningSeries || 0,
      numberOfPadding: val.numberOfPadding || 0,
      startingSeries: val.startingSeries || 0,
      endingSeries: val.endingSeries || 0,
      isRepeating: val.isRepeating || false,
      accountNumber: val.accountNumber || undefined,
      mappingData: {
        branchIds: val.branchIds ?? [],
        productIds: val.productIds ?? [],
        formCheckType: val.formCheckType ?? [],
      },
    };

    if (val.id) {
      this.store.dispatch(updateCheckInventory({ bankId: this.bankId, checkInventory }));
    } else {
      this.store.dispatch(addNewCheckInventory({ bankId: this.bankId, checkInventory }));
    }

    this.dialogRef.close(checkInventory);
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
