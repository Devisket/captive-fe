import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PasswordModule } from 'primeng/password';

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
    tableName: new FormControl(''),
    hasPassword: new FormControl(false),
    password: new FormControl(''),
    checkType: new FormControl(''),
    formType: new FormControl(''),
    deliverTo: new FormControl(''),
    quantity: new FormControl(''),
    brstn: new FormControl(''),
    accountNumber: new FormControl(''),
    accountName1: new FormControl(''),
    accountName2: new FormControl(''),
    concode: new FormControl(''),
    batch: new FormControl(''),
  });

  ngOnInit(): void {}

  onSaveConfiguration() {
    console.log(this.formGroup.value);
  }

  buildRequest():any{

  }
}
