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
  /** Number of checks per booklet for this form check */
  quantity: number;
}

interface ParsedSeries {
  prefix: string;
  number: number;
  width: number;
}

interface CustomCheckOrderRow {
  key: number;
  accountNumber: string;
  accountName1: string | null;
  accountName2: string | null;
  brstn: string | null;
  formCheckId: string | null;
  quantity: number | null;
  deliverTo: string | null;
  concode: string;
  /** Optional. When blank, the series is taken from the check inventory during processing. */
  startingSeries: string;
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
            quantity: Number(fc.quantity) || 0,
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
    };
  }

  // ---------- Series ----------

  /** Splits a series such as "A0000001" into its prefix ("A") and numeric part (1, width 7). */
  private parseSeries(value: string | null | undefined): ParsedSeries | null {
    const match = /^(.*?)(\d+)$/.exec(value?.trim() ?? '');
    if (!match || match[2].length > 15) return null;
    return { prefix: match[1], number: Number(match[2]), width: match[2].length };
  }

  private formCheckOf(row: CustomCheckOrderRow): FormCheckOption | undefined {
    return this.formChecks.find((fc) => fc.value === row.formCheckId);
  }

  hasStartingSeries(row: CustomCheckOrderRow): boolean {
    return !!row.startingSeries?.trim();
  }

  /** Total number of checks for the row: order quantity x form check (booklet) quantity. */
  totalChecks(row: CustomCheckOrderRow): number | null {
    const formCheck = this.formCheckOf(row);
    if (!row.quantity || row.quantity <= 0 || !formCheck?.quantity) return null;
    return row.quantity * formCheck.quantity;
  }

  /**
   * Preview of the ending series that will be generated during processing:
   * starting series + (order quantity x form check quantity) - 1.
   */
  computedEndingSeries(row: CustomCheckOrderRow): string | null {
    const start = this.parseSeries(row.startingSeries);
    const total = this.totalChecks(row);
    if (!start || !total) return null;
    const end = String(start.number + total - 1);
    if (end.length > start.width) return null;
    return start.prefix + end.padStart(start.width, '0');
  }

  startingSeriesError(row: CustomCheckOrderRow): string | null {
    if (!this.hasStartingSeries(row)) return null;
    const start = this.parseSeries(row.startingSeries);
    if (!start) return 'Starting series must end with a number (e.g. A0000001)';
    const formCheck = this.formCheckOf(row);
    if (formCheck && !formCheck.quantity)
      return 'The selected form check has no check quantity configured';
    const total = this.totalChecks(row);
    if (total && String(start.number + total - 1).length > start.width)
      return `Ending series would exceed ${start.width} digits`;
    return null;
  }

  // ---------- Validation ----------

  rowErrors(row: CustomCheckOrderRow): string[] {
    const errors: string[] = [];
    if (!row.accountNumber?.trim()) errors.push('Account number is required');
    if (!row.brstn) errors.push('BRSTN is required');
    if (!row.formCheckId) errors.push('Check / form type is required');
    if (!row.quantity || row.quantity <= 0) errors.push('Quantity must be greater than 0');
    const seriesError = this.startingSeriesError(row);
    if (seriesError) errors.push(seriesError);
    return errors;
  }

  isInvalid(row: CustomCheckOrderRow, field: keyof CustomCheckOrderRow): boolean {
    if (!this.submitted) return false;
    switch (field) {
      case 'accountNumber':
        return !row.accountNumber?.trim();
      case 'brstn':
        return !row.brstn;
      case 'formCheckId':
        return !row.formCheckId;
      case 'quantity':
        return !row.quantity || row.quantity <= 0;
      case 'startingSeries':
        return !!this.startingSeriesError(row);
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
      const accountName1 = row.accountName1?.trim() ?? '';
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
        // Ending series is generated during processing from the starting series,
        // order quantity and form check quantity. When no starting series is given,
        // the series is taken from the check inventory instead.
        startingSeries: row.startingSeries?.trim() || undefined,
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
