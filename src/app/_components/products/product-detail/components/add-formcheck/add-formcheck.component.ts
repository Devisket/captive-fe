import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
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
  ],
})
export class AddFormcheckComponent implements OnInit {
  formCheckTypes = ['Personal', 'Commercial'];

  sampleFormGroup: FormGroup = new FormGroup({
    checkType: new FormControl('', [Validators.required]),
    formType: new FormControl<string>('', [Validators.required]),
    quantity: new FormControl(0, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    description: new FormControl('', [Validators.required]),
    formCheckType: new FormControl('Personal', [Validators.required]),
  });

  constructor(
    private store: Store,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    console.log(this.sampleFormGroup);
  }

  onSubmit() {
  }
}
