import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-bank',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-bank.component.html',
  styleUrl: './add-bank.component.scss',
})
export class AddBankComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
    id: new FormControl(null),
    bankName: new FormControl(null),
    shortName: new FormControl(null),
    description: new FormControl(null),
  });

  private bankService = inject(BanksService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  model: any = {};

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    if (this.config.data.bank) {
      const { bank } = this.config.data;
      this.formGroup.patchValue({
        id: bank.id,
        bankName: bank.bankName,
        shortName: bank.bankShortName,
        description: bank.bankDescription,
      });
    }
  }

  onSubmit() {
    this.bankService.addBank(this.formGroup?.value).subscribe({
      next: (_) => {
        this.toastr.success('Bank has been added successsfully');
        this.closeDialog();
      },
      error: (error) => this.toastr.error('Not saved'),
    });
  }

  onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogRef.close();
  }
}
