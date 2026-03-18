import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { combineLatest, Subscription } from 'rxjs';

interface CsvPreviewRow {
  seriesPattern: string;
  numberOfPadding: string;
  startingSeries: string;
  endingSeries: string;
  warningSeries: string;
  isRepeating: string;
  brSTNCodes: string;
  productCodes: string;
  formCheckTypes: string;
  accountNumber: string;
}

import { CheckInventory, CheckInventoryViewData, ImportCheckInventoryResult } from '../../../../_models/check-inventory';
import { BankValues } from '../../../../_models/values/bankValues';
import { ValuesDto } from '../../../../_models/values/valuesDto';
import { SharedFeature } from '../../../../shared/_store/shared.reducer';
import { TagFeature } from '../../../store/tag/tag.reducers';
import {
  getCheckInventory,
  deleteCheckInventory,
  setCheckInventoryActive,
} from '../../../store/tag/tag.actions';
import { AddCheckInventoryComponent } from '../../tags/check-inventory/add-check-inventory/add-check-inventory.component';
import { TagsService } from '../../../_services/tags.service';

@Component({
  selector: 'app-check-inventory-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    MultiSelectModule,
    PaginatorModule,
    DialogModule,
    TooltipModule,
    TagModule,
  ],
  providers: [DialogService],
  templateUrl: './check-inventory-management.component.html',
  styleUrls: ['./check-inventory-management.component.scss'],
})
export class CheckInventoryManagementComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  bankId: string = '';
  bankValues: BankValues | undefined;
  subscription$ = new Subscription();

  checkInventories: CheckInventoryViewData[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;

  selectedBranchFilter: string[] = [];
  selectedProductFilter: string[] = [];
  selectedFormCheckFilter: string[] = [];

  formCheckOptions: ValuesDto[] = [
    { id: 'Personal', value: 'Personal' },
    { id: 'Commercial', value: 'Commercial' },
  ];

  isImporting = false;
  showImportResult = false;
  importResult: ImportCheckInventoryResult | null = null;

  showCsvPreview = false;
  csvPreviewRows: CsvPreviewRow[] = [];
  selectedFile: File | null = null;

  constructor(private store: Store, private dialogService: DialogService, private tagsService: TagsService) {}

  ngOnInit(): void {
    this.subscription$.add(
      this.store.select(SharedFeature.selectSelectedBankInfoId).subscribe((bankId) => {
        if (bankId) {
          this.bankId = bankId;
          this.loadCheckInventories();
        }
      })
    );

    // combineLatest ensures view data is remapped whenever inventories OR bankValues change,
    // fixing the race condition where bankValues arrives after the first inventory load.
    this.subscription$.add(
      combineLatest([
        this.store.select(TagFeature.selectCheckInventories),
        this.store.select(SharedFeature.selectBankValues),
      ]).subscribe(([inventories, bankValues]) => {
        this.bankValues = bankValues ?? undefined;
        this.checkInventories = inventories.map((inv) => ({
          ...inv,
          viewMappingData: {
            branches: inv.mappingData?.branchIds?.length
              ? inv.mappingData.branchIds.map((id) => this.getBranchName(id)).filter(Boolean) as string[]
              : [],
            products: inv.mappingData?.productIds?.length
              ? inv.mappingData.productIds.map((id) => this.getProductName(id)).filter(Boolean) as string[]
              : [],
            formCheckTypes: inv.mappingData?.formCheckType?.length
              ? inv.mappingData.formCheckType
              : [],
          },
        }));
      })
    );

    this.subscription$.add(
      this.store.select(TagFeature.selectTotalRecords).subscribe((total) => {
        this.totalRecords = total;
      })
    );
  }

  loadCheckInventories(): void {
    this.store.dispatch(
      getCheckInventory({
        query: {
          bankId: this.bankId,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          branchIds: this.selectedBranchFilter.length ? this.selectedBranchFilter : undefined,
          productIds: this.selectedProductFilter.length ? this.selectedProductFilter : undefined,
          formCheckType: this.selectedFormCheckFilter.length ? this.selectedFormCheckFilter : undefined,
        },
      })
    );
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadCheckInventories();
  }

  onReset(): void {
    this.selectedBranchFilter = [];
    this.selectedProductFilter = [];
    this.selectedFormCheckFilter = [];
    this.currentPage = 1;
    this.loadCheckInventories();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.loadCheckInventories();
  }

  get hasActiveFilters(): boolean {
    return this.selectedBranchFilter.length > 0
      || this.selectedProductFilter.length > 0
      || this.selectedFormCheckFilter.length > 0;
  }

  openAddDialog(): void {
    this.dialogService.open(AddCheckInventoryComponent, {
      header: 'Add Check Inventory',
      width: '600px',
      data: { bankId: this.bankId },
    });
  }

  openEditDialog(inventory: CheckInventory): void {
    this.dialogService.open(AddCheckInventoryComponent, {
      header: 'Edit Check Inventory',
      width: '600px',
      data: { bankId: this.bankId, checkInventory: inventory },
    });
  }

  onDelete(inventory: CheckInventory): void {
    this.store.dispatch(deleteCheckInventory({ bankId: this.bankId, checkInventoryId: inventory.id! }));
  }

  onSetActive(inventory: CheckInventory): void {
    this.store.dispatch(setCheckInventoryActive({ bankId: this.bankId, checkInventoryId: inventory.id! }));
  }

  getBranchName(id: string): string | undefined {
    return this.bankValues?.branchValues.find((b) => b.id === id)?.value;
  }

  getProductName(id: string): string | undefined {
    return this.bankValues?.productValues.find((p) => p.id === id)?.value;
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

  private parseCsv(text: string): CsvPreviewRow[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];
    return lines.slice(1).map((line) => {
      const cols = line.split(',');
      return {
        seriesPattern: cols[0]?.trim() ?? '',
        numberOfPadding: cols[1]?.trim() ?? '',
        startingSeries: cols[2]?.trim() ?? '',
        endingSeries: cols[3]?.trim() ?? '',
        warningSeries: cols[4]?.trim() ?? '',
        isRepeating: cols[5]?.trim() ?? '',
        brSTNCodes: cols[6]?.trim() ?? '',
        productCodes: cols[7]?.trim() ?? '',
        formCheckTypes: cols[8]?.trim() ?? '',
        accountNumber: cols[9]?.trim() ?? '',
      };
    });
  }

  confirmImport(): void {
    if (!this.selectedFile || !this.bankId) return;

    this.showCsvPreview = false;
    this.isImporting = true;
    this.tagsService.importCheckInventory(this.bankId, this.selectedFile).subscribe({
      next: (result) => {
        this.importResult = result;
        this.showImportResult = true;
        this.isImporting = false;
        this.selectedFile = null;
        if (result.created > 0 || result.deprecated > 0) {
          this.loadCheckInventories();
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

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
