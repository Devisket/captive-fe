import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-batch-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    InputSwitchModule
  ],
  templateUrl: './create-batch-dialog.component.html',
  styleUrl: './create-batch-dialog.component.scss'
})
export class CreateBatchDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);

  batchForm: FormGroup;

  constructor() {
    this.batchForm = this.fb.group({
      batchName: ['', []],
      deliveryDate: [new Date(), [Validators.required]],
      autoGenerateName: [true]
    });

    this.onAutoGenerateToggle();
  }

  onAutoGenerateToggle(): void {
    const autoGenerate = this.batchForm.get('autoGenerateName')?.value;
    const batchNameControl = this.batchForm.get('batchName');

    if (autoGenerate) {
      batchNameControl?.clearValidators();
      batchNameControl?.setValue(this.generateBatchName());
      batchNameControl?.disable();
    } else {
      batchNameControl?.setValidators([Validators.required]);
      batchNameControl?.setValue('');
      batchNameControl?.enable();
    }
    batchNameControl?.updateValueAndValidity();
  }

  private generateBatchName(): string {
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      '_' +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0');
    return `BATCH_${timestamp}`;
  }

  onSave(): void {
    if (this.batchForm.valid) {
      const formValue = this.batchForm.getRawValue();
      const result = {
        batchName: formValue.autoGenerateName ? this.generateBatchName() : formValue.batchName,
        deliveryDate: formValue.deliveryDate,
        autoGenerateName: formValue.autoGenerateName
      };
      this.ref.close(result);
    }
  }

  onCancel(): void {
    this.ref.close(null);
  }
}