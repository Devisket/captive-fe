import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bank } from '../../../../_models/bank';
import { BankBranch, ImportBranchResult } from '../../../../_models/bank-branch';
import { BranchService } from '../../../_services/branch.service';
import { ToastrService } from 'ngx-toastr';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SharedFeature } from '../../../../shared/_store/shared.reducer';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AddBranchComponent } from '../add-branch/add-branch.component';

interface BranchCsvPreviewRow {
  brstnCode: string;
  branchName: string;
  branchCode: string;
  branchAddress1: string;
  branchStatus: string;
}

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss',
})
export class BranchListComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  private branchServices = inject(BranchService);
  branches: BankBranch[] = [];
  branch?: BankBranch;
  toastr = inject(ToastrService);
  bankId: string | undefined = undefined;
  bankId$: Observable<string | null> = new Observable<string | null>();

  isImporting = false;
  showCsvPreview = false;
  csvPreviewRows: BranchCsvPreviewRow[] = [];
  selectedFile: File | null = null;
  showImportResult = false;
  importResult: ImportBranchResult | null = null;

  constructor(private store: Store, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.bankId$ = this.store.select(SharedFeature.selectSelectedBankInfoId);

    this.bankId$.subscribe((x) => {
      this.bankId = x ?? undefined;
      this.getBranches();
    });
  }

  getBranches() {
    if (this.bankId) {
      this.branchServices.getBranches(this.bankId).subscribe((data) => {
        if (!data) return;
        this.branches = data.branches;
        this.branches.sort((a, b) => a.branchName.localeCompare(b.branchName));
      });
    }
  }

  deleteBranch(bankId: any, branchId: any, event: Event) {
    if (!confirm('Confirm Deletion!')) {
      event.preventDefault();
      return;
    }
    this.branchServices.deleteBranch(bankId, branchId).subscribe({
      error: (error) => console.log(error),
      next: (_) => {
        this.toastr.success('successfully deleted branch.');
        this.branches = this.branches.filter(
          (branch) => branch.id !== branchId
        );
      },
    });
  }

  onAddBranch() {
    this.OpenAddBranchDialog({
      header: 'Add Branch',
      width: '50%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        onSubmit: (bankBranch: BankBranch) => {
          console.log(bankBranch);
        },
      },
    });
  }

  onDeleteBranch(branch: BankBranch, event: Event) {}

  onUpdateBranch(branch: BankBranch) {
    this.OpenAddBranchDialog({
      header: 'Add Branch',
      width: '50%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        branchData: branch,
        onSubmit: (bankBranch: BankBranch) => this.OnSubmitBranch(bankBranch),
      },
    });
  }

  private OpenAddBranchDialog(dialogConfig: DynamicDialogConfig) {
    this.dialogService.open(AddBranchComponent, dialogConfig);
  }

  OnSubmitBranch(bankBranch: BankBranch) {
    console.log(bankBranch);
  }

  triggerImport(): void {
    this.fileInputRef.nativeElement.value = '';
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.bankId) return;

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.csvPreviewRows = this.parseCsv(text);
      this.showCsvPreview = true;
    };
    reader.readAsText(file);
  }

  private parseCsv(text: string): BranchCsvPreviewRow[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];
    return lines.slice(1).map((line) => {
      const cols = this.parseCsvLine(line);
      return {
        brstnCode: cols[0]?.trim() ?? '',
        branchName: cols[1]?.trim() ?? '',
        branchCode: cols[2]?.trim() ?? '',
        branchAddress1: cols[3]?.trim() ?? '',
        branchStatus: cols[8]?.trim() ?? '',
      };
    });
  }

  private parseCsvLine(line: string): string[] {
    const cols: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          cols.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
    }
    cols.push(current);
    return cols;
  }

  confirmImport(): void {
    if (!this.selectedFile || !this.bankId) return;

    this.showCsvPreview = false;
    this.isImporting = true;
    this.branchServices.importBranches(this.bankId, this.selectedFile).subscribe({
      next: (result) => {
        this.importResult = result;
        this.showImportResult = true;
        this.isImporting = false;
        this.selectedFile = null;
        if (result.created > 0 || result.updated > 0) {
          this.getBranches();
        }
      },
      error: () => {
        this.isImporting = false;
        this.selectedFile = null;
      },
    });
  }

  cancelImport(): void {
    this.showCsvPreview = false;
    this.selectedFile = null;
    this.csvPreviewRows = [];
  }

  downloadCsv(): void {
    const header = 'BRSTNCode,BranchName,BranchCode,BranchAddress1,BranchAddress2,BranchAddress3,BranchAddress4,BranchAddress5,BranchStatus';
    const rows = this.branches.map((b) =>
      [
        b.brstnCode ?? '',
        b.branchName ?? '',
        b.branchCode ?? '',
        b.branchAddress1 ?? '',
        b.branchAddress2 ?? '',
        b.branchAddress3 ?? '',
        b.branchAddress4 ?? '',
        b.branchAddress5 ?? '',
        b.branchStatus ?? 'Active',
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );

    const csv = [header, ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branches.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
