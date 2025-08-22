import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BranchService } from '../../../_services/branch.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EnumsService } from '../../../_services/enums.service';
import { BankBranch } from '../../../../_models/bank-branch';
import { Store } from '@ngrx/store';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.scss',
})
export class AddBranchComponent implements OnInit {
  constructor(
    private store: Store,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) {}

  formGroup = new FormGroup({
    branchId: new FormControl(''),
    branchName: new FormControl('', [Validators.required]),
    brstnCode: new FormControl('', [Validators.required]),
    branchCode: new FormControl('', [Validators.required]),
    BranchAddress1: new FormControl('', [Validators.required]),
    BranchAddress2: new FormControl('', [Validators.required]),
    BranchAddress3: new FormControl('', [Validators.required]),
    BranchAddress4: new FormControl('', [Validators.required]),
    BranchAddress5: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if(this.dynamicDialogConfig.data.branchData){
      this.formGroup.patchValue(this.dynamicDialogConfig.data.branchData);
    }
  }

  onSubmit() {
    if(this.formGroup.valid){
      
    }
  }
  onClose() {
    this.dialogRef.close();
  }
}
