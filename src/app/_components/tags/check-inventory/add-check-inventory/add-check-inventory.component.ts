import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CheckInventory } from '../../../../_models/check-inventory';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { addNewCheckInventory } from '../../_store/tag.actions';
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
    CommonModule
  ]
})
export class AddCheckInventoryComponent implements OnInit, OnDestroy {
  constructor(
    private dialogRef: DynamicDialogRef,
    private DynamicDialogConfig: DynamicDialogConfig,
    private store: Store
  ) {}

  tagId: string = '';
  bankId: string = '';

  formGroup = new FormGroup({
    id: new FormControl(''),
    seriesPattern: new FormControl('', [Validators.required]),
    warningSeries: new FormControl(0, [Validators.required]),
    numberOfPadding: new FormControl(0, [Validators.required, Validators.min(1)]),
    startingSeries: new FormControl(0, [Validators.required]),
    endingSeries: new FormControl(0, [Validators.required]),
    isRepeating: new FormControl(false),
  }, {
    validators: [
      (control: AbstractControl): ValidationErrors | null => {
        const form = control as FormGroup;
        const start = form.get('startingSeries')?.value;
        const end = form.get('endingSeries')?.value;
        if (start > end) {
          return { startGreaterThanEnd: true };
        }
        return null;
      },
      (control: AbstractControl): ValidationErrors | null => {
        const form = control as FormGroup;
        const warning = form.get('warningSeries')?.value;
        const start = form.get('startingSeries')?.value;
        const end = form.get('endingSeries')?.value;
        
        if (warning < start) {
          return { warningLessThanStart: true };
        }
        if (warning >= end) {
          return { warningGreaterThanOrEqualEnd: true };
        }
        return null;
      }
    ]
  });

  suscription$ = new Subscription();

  ngOnInit(): void {
    this.tagId = this.DynamicDialogConfig.data.tagId;
    this.bankId = this.DynamicDialogConfig.data.bankId;

    // Subscribe to series pattern changes to convert to uppercase
    this.formGroup.get('seriesPattern')?.valueChanges.subscribe(value => {
      if (value) {
        const upperValue = value.toUpperCase();
        if (value !== upperValue) {
          this.formGroup.patchValue({
            seriesPattern: upperValue
          }, { emitEvent: false });
        }
      }
    });

    if(this.DynamicDialogConfig.data.checkInventory){
      console.log(this.DynamicDialogConfig.data.checkInventory);
      this.formGroup.patchValue(this.DynamicDialogConfig.data.checkInventory);
    }
  }
  onSubmit() {
    if(this.formGroup.valid){
      const checkInventory: CheckInventory = {
        id: this.formGroup.value.id || '',
        tagId: this.tagId,
        currentSeries: 0,
        isActive: true,
        seriesPattern: this.formGroup.value.seriesPattern || '',
        warningSeries: this.formGroup.value.warningSeries || 0,
        numberOfPadding: this.formGroup.value.numberOfPadding || 0,
        startingSeries: this.formGroup.value.startingSeries || 0,
        endingSeries: this.formGroup.value.endingSeries || 0,
        isRepeating: this.formGroup.value.isRepeating || false,
      };
    
      this.store.dispatch(addNewCheckInventory({ tagId: this.tagId, checkInventory }));

      this.dialogRef.close(checkInventory);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.suscription$.unsubscribe();
  }
}
