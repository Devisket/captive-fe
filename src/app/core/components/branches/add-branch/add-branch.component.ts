import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { BankBranch } from '../../../../_models/bank-branch';
import { BranchStatus } from '../../../../_models/constants';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { BranchSelectorComponent } from '../../../../shared/components/branch-selector/branch-selector';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
  ],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.scss',
})
export class AddBranchComponent implements OnInit {
  BranchStatus = BranchStatus;

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService
  ) {}

  dropDownValue = [
    { name: 'Active', code: BranchStatus.Acitve },
    { name: 'Closing', code: BranchStatus.Closing },
    { name: 'Inactive', code: BranchStatus.Inactive },
  ];

  formGroup = new FormGroup({
    id: new FormControl(''),
    branchName: new FormControl('', [Validators.required]),
    brstnCode: new FormControl('', [Validators.required]),
    branchCode: new FormControl('', [Validators.required]),
    branchAddress1: new FormControl('', [Validators.required]),
    branchAddress2: new FormControl('', [Validators.required]),
    branchAddress3: new FormControl('', [Validators.required]),
    branchAddress4: new FormControl('', [Validators.required]),
    branchAddress5: new FormControl('', [Validators.required]),
    branchStatus: new FormControl<BranchStatus>(0, [Validators.required]),
    mergingBranchId: new FormControl(),
  });

  ngOnInit(): void {
    if (this.dynamicDialogConfig.data) {
      this.formGroup.patchValue(this.dynamicDialogConfig.data.branchData);
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const bankBranch: BankBranch = this.formGroup.value as BankBranch;
      this.dynamicDialogConfig.data.onSubmit(bankBranch);
      this.dialogRef.close();
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  get FormBranchStatus(): BranchStatus {
    return this.formGroup.get('branchStatus')?.value as BranchStatus;
  }

  onChangeBranchStatus() {
    if (this.FormBranchStatus === BranchStatus.Closing) {
      this.formGroup.addValidators([Validators.required]);
    }
  }

  openBranchSelectorDialog() {
    this.dialogService.open(BranchSelectorComponent, {
      header: 'Branch Selector',
      width: '50%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10001,
    });
  }
}
