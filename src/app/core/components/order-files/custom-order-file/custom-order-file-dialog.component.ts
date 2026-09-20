import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { ProductService } from '../../../_services/product.service';
import { BranchService } from '../../../_services/branch.service';
import { FormChecksService } from '../../../_services/form-check.service';
import { OrderFilesService } from '../../../_services/order-files.service';
import {
  CreateCustomOrderFileResponse,
  CustomCheckOrderInput,
} from '../../../../_models/order-file';

interface SelectOption {
  label: string;
  value: string;
}

interface FormCheckOption extends SelectOption {
  checkType: string;
  formType: string;
}

interface CustomCheckOrderRow {
  key: number;
  accountNumber: string;
  accountName1: string;
  accountName2: string;
  brstn: string | null;
  formCheckId: string | null;
  quantity: number | null;
  deliverTo: string | null;
  concode: string;
  startingSeries: string;
  endingSeries: string;
}

@Component({
  selector: 'app-custom-order-file-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,
  ],
  templateUrl: './custom-order-file-dialog.component.html',
  styleUrl: './custom-order-file-dialog.component.scss',
})
export class CustomOrderFileDialogComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() bankId = '';
  @Input() batchId = '';
  @Output() created = new EventEmitter<CreateCustomOrderFileResponse>();

  private productService = inject(ProductService);
  private branchService = inject(BranchService);
  private formChecksService = inject(FormChecksService);
  private orderFilesService = inject(OrderFilesService);
  private subscriptions = new Subscription();

  products: SelectOption[] = [];
  branches: SelectOption[] = [];
  formChecks: FormCheckOption[] = [];

  selectedProductId: string | null = null;
  fileName = '';
  rows: CustomCheckOrderRow[] = [];

  loadingLookups = false;
  loadingFormChecks = false;
  saving = false;
  submitted = false;
  errorMessage: string | null = null;

  private rowKey = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.reset();
      this.loadLookups();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ---------- Lookups ----------

  private loadLookups(): void {
    if (!this.bankId) return;
    this.loadingLookups = true;

    this.subscriptions.add(
      this.productService.getAllProducts(this.bankId).subscribe({
        next: (products: any[]) => {
          this.products = (products ?? [])
            .slice()
            .sort((a, b) => (a.productSequence ?? 0) - (b.productSequence ?? 0))
            .map((p) => ({ label: p.productName, value: p.productId }));
          this.loadingLookups = false;
        },
        error: () => {
          this.loadingLookups = false;
          this.errorMessage = 'Unable to load products for this bank.';
        },
      })
    );

    this.subscriptions.add(
      this.branchService.getBranches(this.bankId).subscribe({
        next: (response: any) => {
          const branches: any[] = response?.branches ?? response ?? [];
          this.branches = branches
            .filter((b) => !!b.brstnCode)
            .map((b) => ({
              label: `${b.brstnCode} - ${b.branchName}`,
              value: b.brstnCode,
            }));
        },
        error: () => {
          this.errorMessage = 'Unable to load branches for this bank.';
        },
      })
    );
  }

  onProductChange(): void {
    this.formChecks = [];
    this.rows.forEach((row) => (row.formCheckId = null));
    if (!this.selectedProductId) return;

    this.loadingFormChecks = true;
    this.subscriptions.add(
      this.formChecksService.getAllFormChecks(this.selectedProductId).subscribe({
        next: (formChecks: any[]) => {
          this.formChecks = (formChecks ?? []).map((fc) => ({
            value: fc.id,
            checkType: fc.checkType,
            formType: fc.formType,
            label:
              `${fc.checkType} / ${fc.formType}` +
              (fc.description ? ` - ${fc.description}` : '') +
              (fc.formCheckType ? ` (${fc.formCheckType})` : ''),
          }));
          // Pre-select when the product only has a single form check
          if (this.formChecks.length === 1) {
            this.rows.forEach((row) => (row.formCheckId = this.formChecks[0].value));
          }
          this.loadingFormChecks = false;
        },
        error: () => {
          this.loadingFormChecks = false;
          this.errorMessage = 'Unable to load form checks for the selected product.';
        },
      })
    );
  }

  // ---------- Rows ----------

  addRow(): void {
    this.rows = [...this.rows, this.newRow()];
  }

  duplicateRow(row: CustomCheckOrderRow): void {
    const index = this.rows.indexOf(row);
    const copy: CustomCheckOrderRow = {
      ...row,
      key: ++this.rowKey,
      accountNumber: '',
      startingSeries: '',
      endingSeries: '',
    };
    this.rows = [...this.rows.slice(0, index + 1), copy, ...this.rows.slice(index + 1)];
  }

  removeRow(row: CustomCheckOrderRow): void {
    this.rows = this.rows.filter((r) => r !== row);
  }

  trackRow(_: number, row: CustomCheckOrderRow): number {
    return row.key;
  }

  private newRow(): CustomCheckOrderRow {
    return {
      key: ++this.rowKey,
      accountNumber: '',
      accountName1: '',
      accountName2: '',
      brstn: null,
      formCheckId: this.formChecks.length === 1 ? this.formChecks[0].value : null,
      quantity: 1,
      deliverTo: null,
      concode: '',
      startingSeries: '',
      endingSeries: '',
    };
  }

  // ---------- Validation ----------

  rowErrors(row: CustomCheckOrderRow): string[] {
    const errors: string[] = [];
    if (!row.accountNumber?.trim()) errors.push('Account number is required');
    if (!row.accountName1?.trim()) errors.push('Account name is required');
    if (!row.brstn) errors.push('BRSTN is required');
    if (!row.formCheckId) errors.push('Check / form type is required');
    if (!row.quantity || row.quantity <= 0) errors.push('Quantity must be greater than 0');
    const hasStart = !!row.startingSeries?.trim();
    const hasEnd = !!row.endingSeries?.trim();
    if (hasStart !== hasEnd) errors.push('Provide both starting and ending series, or neither');
    return errors;
  }

  isInvalid(row: CustomCheckOrderRow, field: keyof CustomCheckOrderRow): boolean {
    if (!this.submitted) return false;
    switch (field) {
      case 'accountNumber':
        return !row.accountNumber?.trim();
      case 'accountName1':
        return !row.accountName1?.trim();
      case 'brstn':
        return !row.brstn;
      case 'formCheckId':
        return !row.formCheckId;
      case 'quantity':
        return !row.quantity || row.quantity <= 0;
      case 'startingSeries':
      case 'endingSeries':
        return !!row.startingSeries?.trim() !== !!row.endingSeries?.trim();
      default:
        return false;
    }
  }

  get hasDuplicateAccounts(): boolean {
    const accounts = this.rows
      .map((r) => r.accountNumber?.trim())
      .filter((a) => !!a);
    return new Set(accounts).size !== accounts.length;
  }

  get canSubmit(): boolean {
    return !!this.selectedProductId && !this.saving;
  }

  // ---------- Submit ----------

  submit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (!this.selectedProductId) {
      this.errorMessage = 'Please select a product.';
      return;
    }

    const invalidRow = this.rows.findIndex((r) => this.rowErrors(r).length > 0);
    if (invalidRow >= 0) {
      this.errorMessage = `Row ${invalidRow + 1}: ${this.rowErrors(this.rows[invalidRow]).join(', ')}.`;
      return;
    }

    const checkOrders: CustomCheckOrderInput[] = this.rows.map((row) => {
      const formCheck = this.formChecks.find((fc) => fc.value === row.formCheckId)!;
      const accountName1 = row.accountName1.trim();
      const accountName2 = row.accountName2?.trim() ?? '';
      return {
        accountNumber: row.accountNumber.trim(),
        brstn: row.brstn!,
        checkType: formCheck.checkType,
        formType: formCheck.formType,
        quantity: row.quantity!,
        accountName1,
        accountName2,
        mainAccountName: [accountName1, accountName2].filter((x) => !!x).join(' '),
        deliverTo: row.deliverTo ?? undefined,
        concode: row.concode?.trim() || undefined,
        startingSeries: row.startingSeries?.trim() || undefined,
        endingSeries: row.endingSeries?.trim() || undefined,
      };
    });

    this.saving = true;
    this.subscriptions.add(
      this.orderFilesService
        .createCustomOrderFile({
          bankId: this.bankId,
          batchId: this.batchId,
          productId: this.selectedProductId,
          fileName: this.fileName?.trim() || undefined,
          checkOrders,
        })
        .subscribe({
          next: (response) => {
            this.saving = false;
            this.created.emit(response);
            this.close();
          },
          error: (err) => {
            this.saving = false;
            this.errorMessage =
              err?.error?.Message ??
              err?.error?.message ??
              (typeof err?.error === 'string' ? err.error : null) ??
              'Failed to create the custom order file.';
          },
        })
    );
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  private reset(): void {
    this.selectedProductId = null;
    this.fileName = '';
    this.formChecks = [];
    this.rows = [this.newRow()];
    this.submitted = false;
    this.saving = false;
    this.errorMessage = null;
  }
}
