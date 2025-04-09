import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule, NgClass } from '@angular/common';
import {
  createFormCheck,
  updateFormCheck,
} from '../../../_store/formchecks/formchecks.action';

@Component({
  selector: 'app-add-formcheck',
  templateUrl: './add-formcheck.component.html',
  styleUrls: ['./add-formcheck.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    FloatLabelModule,
    CommonModule,
    NgClass,
  ],
})
export class AddFormcheckComponent implements OnInit {
  formCheckTypes = [
    { label: 'Personal', value: 'Personal' },
    { label: 'Commercial', value: 'Commercial' },
  ];

  formGroup: FormGroup = new FormGroup({
    id: new FormControl(null),
    checkType: new FormControl('', [Validators.required]),
    formType: new FormControl<string>('', [Validators.required]),
    quantity: new FormControl(0, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    description: new FormControl(''),
    formCheckType: new FormControl('Personal', [Validators.required]),
    fileInitial: new FormControl('', [Validators.required]),
  });

  constructor(
    private store: Store,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    if (this.config.data.formCheck) {
      this.formGroup.patchValue(this.config.data.formCheck);
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.formGroup.value.id) {
        this.store.dispatch(
          updateFormCheck({
            productId: this.config.data.productId,
            formCheck: this.formGroup.value,
          })
        );
      } else {
        this.store.dispatch(
          createFormCheck({
            productId: this.config.data.productId,
            formCheck: this.formGroup.value,
          })
        );
      }

      this.onClose();
    }
  }

  onClose() {
    this.ref.close();
  }
}
