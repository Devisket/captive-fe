import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { BatchesService } from '../../../_services/batches.service';
import { Batch } from '../../../../_models/batch';
import { FormsModule, NgForm } from '@angular/forms';
import { OrderFilesService } from '../../../_services/order-files.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { OrderFile } from '../../../../_models/order-file';
import { Subscription, filter, map, take } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckOrders } from '../../../../_models/check-order';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { AddCheckOrderComponent } from './_components/add-check-order/add-check-order.component';
import { LogType } from '../../../../_models/constants';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';
import {
  getOrderFiles,
  processOrderFile,
  validateOrderFile,
  deleteOrderFile,
  holdFloatingCheckOrder,
  releaseFloatingCheckOrder,
  deleteFloatingCheckOrder,
  uploadOrderFiles,
  pollOrderFiles,
  updateOrderFileStatusDetail,
  clearOrderFiles,
} from '../../../store/order-file/order-file.actions';
import { OrderFileFeature } from '../../../store/order-file/order-file.reducers';
import { BatchFeature } from '../../../store/batch/batch.reducer';
import { getAllBatches, processBatch, confirmBatchProcess, cancelBatchProcess, pollBatchJob, pollBatchOrderFiles } from '../../../store/batch/batch.actions';
import { BatchJob } from '../../../../_models/batch-job';
import { SharedFeature } from '../../../../shared/_store/shared.reducer';

@Component({
  selector: 'app-order-file-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgFor,
    NgIf,
    RouterLink,
    TableModule,
    ButtonModule,
    DialogModule,
    TooltipModule,
    PanelModule,
    ProgressBarModule,
    AddCheckOrderComponent,
  ],
  templateUrl: './order-files-list.component.html',
  styleUrl: './order-files-list.component.scss',
})
export class UploadOrderFilesComponent implements OnInit, OnDestroy {
  @ViewChild('uploadOrderFileForm') uploadOrderFileForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.uploadOrderFileForm?.dirty) {
      $event.returnValue = true;
    }
  }

  orderFileCols = [
    '',
    'File Name',
    'Status',
    'Personal Quantity',
    'Commercial Quantity',
    'Action',
  ];

  checkOrderCols = [
    { columnName: 'Account Number', value: 'accountNumber' },
    { columnName: 'BRSTN', value: 'brstn' },
    { columnName: 'Name', value: 'mainAccountName' },
    { columnName: 'Quantity', value: 'quantity' },
    { columnName: 'Deliver To', value: 'deliverTo' },
    { columnName: 'Error Message', value: 'errorMessage' },
    { columnName: 'Action', value: '' },
  ];

  displayedColumns = ['accountNumber', 'brstn', 'quantity', 'deliverTo', 'error'];

  dialogData = {
    dialogTitle: 'Warning',
    dialogType: LogType.Warning,
    dialogMessage: 'This is a warning message',
  };

  route = inject(ActivatedRoute);
  router = inject(Router);
  bankService = inject(BanksService);
  batchService = inject(BatchesService);
  orderFileService = inject(OrderFilesService);
  toastr = inject(ToastrService);
  batch?: Batch;
  model: any = {};
  selectedFiles: File[] = [];
  orderFiles: OrderFile[] = [];
  visibleBatches: Set<string> = new Set();
  expandedFiles: Set<string> = new Set();
  private refreshInterval: any;
  private pendingAutoExpansion = false;
  private statusPollingInterval: any;
  private jobPollingInterval: any = null;
  $subscription = new Subscription();
  bankInfoId: string = '';
  isPageMode = false;

  visibleDialog: boolean = false;
  isPolling: boolean = false;
  currentBatchJob: BatchJob | null = null;
  showInventoryWarningDialog: boolean = false;

  // Modal state
  showCheckOrderModal: boolean = false;
  selectedCheckOrder: CheckOrders | null = null;
  selectedOrderFileId: string = '';

  errorMessage: string | undefined = undefined;

  constructor(private store: Store, @Optional() private config: DynamicDialogConfig) {
    if (this.config?.data) {
      this.bankInfoId = this.config.data.bankId;
      this.batch = this.config.data.batch;
    }
  }

  ngOnInit(): void {
    this.setupCommonSubscriptions();

    if (!this.batch) {
      this.isPageMode = true;
      this.initPageMode();
    } else {
      this.initBatchDependentParts();
    }
  }

  private initPageMode(): void {
    const batchId = this.route.snapshot.paramMap.get('batchId')!;

    this.$subscription.add(
      this.store.select(SharedFeature.selectSelectedBankInfoId).pipe(
        filter((id): id is string => !!id),
        take(1)
      ).subscribe(bankId => {
        this.bankInfoId = bankId;
        this.store.dispatch(getAllBatches({ bankId }));

        this.$subscription.add(
          this.store.select(BatchFeature.selectBatches).pipe(
            map(batches => batches.find(b => b.id === batchId)),
            filter((b): b is Batch => !!b),
            take(1)
          ).subscribe(batch => {
            this.batch = batch;
            this.initBatchDependentParts();
          })
        );
      })
    );
  }

  private initBatchDependentParts(): void {
    this.store.dispatch(clearOrderFiles());
    this.store.dispatch(
      getOrderFiles({ bankId: this.bankInfoId, batchId: this.batch!.id })
    );

    if (this.batch?.id) {
      this.orderFileService.startConnection(this.batch.id);
      this.$subscription.add(
        this.orderFileService.orderFileStatus$.subscribe((orderFile) => {
          this.store.dispatch(updateOrderFileStatusDetail({ orderFile }));
          if (orderFile.status === 'Pending' || orderFile.status === 'Completed') {
            this.store.dispatch(pollOrderFiles({ bankId: this.bankInfoId, batchId: this.batch!.id }));
          }
        })
      );
    }
  }

  private setupCommonSubscriptions(): void {
    this.$subscription.add(
      this.store.select(OrderFileFeature.selectLog).subscribe((log) => {
        console.log(log);
      })
    );
    this.$subscription.add(
      this.store.select(OrderFileFeature.selectError).subscribe((error) => {
        if (error) {
          this.errorMessage = error.error.Message;
        }
      })
    );
    this.$subscription.add(
      this.store.select(OrderFileFeature.selectOrderFiles).subscribe((orderFiles) => {
        if (orderFiles && orderFiles.length > 0) {
          this.orderFiles = orderFiles.map((orderFile) => ({ ...orderFile }));
          this.autoExpandFilesWithErrors();
          if (this.pendingAutoExpansion) {
            this.pendingAutoExpansion = false;
          }
          this.manageStatusPolling();
        } else {
          this.orderFiles = [];
          this.stopStatusPolling();
        }
      })
    );
    this.$subscription.add(
      this.store.select(BatchFeature.selectJobs).subscribe((jobs) => {
        const batchId = this.batch?.id;
        if (!batchId) return;
        const job = jobs[batchId] ?? null;
        this.currentBatchJob = job;

        if (job?.status === 'Pending' || job?.status === 'Running') {
          this.startJobPolling(batchId);
        } else {
          this.stopJobPolling();
          if (job?.status === 'AwaitingConfirmation') {
            this.showInventoryWarningDialog = true;
          } else {
            this.showInventoryWarningDialog = false;
          }
          if (job?.status === 'Completed') {
            this.store.dispatch(getOrderFiles({ bankId: this.bankInfoId, batchId }));
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.errorMessage = undefined;
    this.stopStatusPolling();
    this.stopJobPolling();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.batch?.id) {
      this.orderFileService.leaveBatchGroup(this.batch.id);
    }
  }

  goBack(): void {
    this.router.navigate(['batches'], { relativeTo: this.route.parent });
  }

  getBatch() {
    let batchId = this.route.snapshot.paramMap.get('batchId');
    let bankId = this.route.snapshot.paramMap.get('bankId');
    this.$subscription.add(
      this.batchService.getBatches(bankId).subscribe((data) => {
        this.batch = data.batchFiles.find(
          (batch: Batch) => batch.id === batchId
        );
      })
    );
  }

  onValidateOrderFile(orderFileId: string): void {
    this.pendingAutoExpansion = true;
    this.store.dispatch(
      validateOrderFile({
        bankId: this.bankInfoId,
        batchId: this.batch!.id,
        orderFileId: orderFileId,
      })
    );
  }

  onProcessOrderFile(orderFileId: string): void {
    this.store.dispatch(
      processOrderFile({
        bankId: this.bankInfoId,
        batchId: this.batch!.id,
        orderFileId: orderFileId,
      })
    );
  }

  onHoldCheckOrder(orderFileId: string, checkOrderId: string): void {
    this.store.dispatch(
      holdFloatingCheckOrder({
        bankId: this.bankInfoId,
        batchId: this.batch!.id,
        orderFileId: orderFileId,
        checkOrderId: checkOrderId,
      })
    );
  }

  onReleaseCheckOrder(orderFileId: string, checkOrderId: string): void {
    this.store.dispatch(
      releaseFloatingCheckOrder({
        bankId: this.bankInfoId,
        batchId: this.batch!.id,
        orderFileId: orderFileId,
        checkOrderId: checkOrderId,
      })
    );
  }

  onDeleteCheckOrder(orderFileId: string, checkOrderId: string): void {
    this.store.dispatch(
      deleteFloatingCheckOrder({
        bankId: this.bankInfoId,
        batchId: this.batch!.id,
        orderFileId: orderFileId,
        checkOrderId: checkOrderId,
      })
    );
  }

  onDeleteOrderFile(orderFileId: string): void {
    this.store.dispatch(
      deleteOrderFile({
        bankId: this.bankInfoId,
        batchId: this.batch!.id,
        orderFileId: orderFileId,
      })
    );
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  clearSelection(): void {
    this.selectedFiles = [];
    const fileInput = document.getElementById('formFileMultiple') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadOrderFile(): void {
    if (this.selectedFiles.length > 0) {
      const formData: FormData = new FormData();
      this.selectedFiles.forEach((file) => {
        formData.append('files', file, file.name);
      });
      if (this.bankInfoId) {
        formData.append('bankId', this.bankInfoId);
      }
      if (this.batch) {
        formData.append('batchId', this.batch?.id);
      }
      this.store.dispatch(uploadOrderFiles({ formData, bankId: this.bankInfoId, batchId: this.batch!.id }));
    }
  }

  refreshView() {}

  getOrderFiles() {
    const batchId = this.batch?.id;
    this.orderFileService
      .getOrderFiles(this.bankInfoId, batchId)
      .subscribe((data) => {
        if (!data) return;
        if (!data.orderFiles) return;
        this.orderFiles = data.orderFiles.filter((orderFile: OrderFile) => {
          return orderFile.batchId === batchId;
        });

        this.orderFiles.forEach((orderFile: OrderFile) => {
          if (orderFile.status === 'Processing') {
            this.refreshView();
          } else {
            clearInterval(this.refreshInterval);
          }

          if (orderFile.status === 'Pending') {
            const invalidCheckOrders = orderFile.checkOrders.filter(
              (checkOrder: CheckOrders) =>
                !checkOrder.isValid && checkOrder.errorMessage !== ''
            );
            invalidCheckOrders.forEach((invalidCheckOrder: CheckOrders) => {
              this.dialogData.dialogType = LogType.Error;
              this.dialogData.dialogMessage = invalidCheckOrder.errorMessage ?? '';
              this.visibleDialog = true;
            });
          }
        });
      });
  }

  toggleBatchVisibility(batchName: string): void {
    if (this.visibleBatches.has(batchName)) {
      this.visibleBatches.delete(batchName);
    } else {
      this.visibleBatches.add(batchName);
    }
  }

  canBeProcess(orderFile: OrderFile): boolean {
    if (!orderFile.checkOrders) return false;
    return orderFile.checkOrders.some((x) => !x.isValid && !x.isOnHold);
  }

  isOrderFileCompleted(orderFile: OrderFile) {
    return orderFile.status === 'Completed';
  }

  isBatchVisible(batchName: string): boolean {
    return this.visibleBatches.has(batchName);
  }

  isCheckOrderHasError(checkOrder: CheckOrders): boolean {
    return !checkOrder.isValid;
  }

  showDialog() {
    this.visibleDialog = true;
  }

  processAll() {
    this.store.dispatch(processBatch({ bankId: this.bankInfoId, batchId: this.batch!.id }));
  }

  isBatchJobProcessing(): boolean {
    return !!this.currentBatchJob &&
      (this.currentBatchJob.status === 'Pending' || this.currentBatchJob.status === 'Running');
  }

  get activeWarningMessages(): string[] {
    return this.currentBatchJob?.warnings ?? [];
  }

  onConfirmBatchProcess(): void {
    this.showInventoryWarningDialog = false;
    this.store.dispatch(confirmBatchProcess({ bankId: this.bankInfoId, batchId: this.batch!.id }));
  }

  onCancelBatchProcess(): void {
    this.showInventoryWarningDialog = false;
    this.store.dispatch(cancelBatchProcess({ bankId: this.bankInfoId, batchId: this.batch!.id }));
  }

  validateAll() {
    this.pendingAutoExpansion = true;
    this.orderFileService
      .validateAllOrderFiles(this.bankInfoId, this.batch!.id)
      .subscribe({
        next: (_) => {
          this.store.dispatch(
            getOrderFiles({ bankId: this.bankInfoId, batchId: this.batch!.id })
          );
        },
      });
  }

  canBeValidateByBatch(orderFiles: OrderFile[]): boolean {
    return orderFiles.filter((x) => x.status !== 'Valid' && x.status !== 'Completed').length > 0;
  }

  canBeProcessByBatch(orderFiles: OrderFile[]): boolean {
    return orderFiles.filter((x) => x.status !== 'Valid' && x.status !== 'Completed').length > 0;
  }

  canBeValidate(orderFile: OrderFile): boolean {
    return orderFile.status !== 'Valid' && orderFile.status !== 'Completed';
  }

  canOrderFileBeProcess(orderFile: OrderFile): boolean {
    return orderFile.status === 'Valid';
  }

  orderFileIsCompleted(orderFile: OrderFile): boolean {
    return orderFile.status === 'Completed';
  }

  areAllOrderFilesValid(): boolean {
    if (!this.orderFiles || this.orderFiles.length === 0) return false;
    return this.orderFiles.every(file => file.status === 'Valid');
  }

  shouldShowStatusSpinner(orderFile: OrderFile): boolean {
    return orderFile.status === 'Processing' || orderFile.status === 'GeneratingReport';
  }

  private startJobPolling(batchId: string): void {
    if (this.jobPollingInterval) return;
    this.jobPollingInterval = setInterval(() => {
      this.store.dispatch(pollBatchJob({ bankId: this.bankInfoId, batchId }));
      this.store.dispatch(pollBatchOrderFiles({ bankId: this.bankInfoId, batchId }));
    }, 3000);
  }

  private stopJobPolling(): void {
    if (this.jobPollingInterval) {
      clearInterval(this.jobPollingInterval);
      this.jobPollingInterval = null;
    }
  }

  private hasProcessingFiles(): boolean {
    return this.orderFiles.some(file =>
      file.status === 'Processing' || file.status === 'GeneratingReport'
    );
  }

  private manageStatusPolling(): void {
    if (this.hasProcessingFiles()) {
      this.startStatusPolling();
    } else {
      this.stopStatusPolling();
    }
  }

  private startStatusPolling(): void {
    if (this.statusPollingInterval) return;
    this.isPolling = true;
    this.statusPollingInterval = setInterval(() => {
      if (this.hasProcessingFiles()) {
        this.refreshOrderFiles();
      } else {
        this.stopStatusPolling();
      }
    }, 25000);
  }

  private stopStatusPolling(): void {
    if (this.statusPollingInterval) {
      clearInterval(this.statusPollingInterval);
      this.statusPollingInterval = null;
      this.isPolling = false;
    }
  }

  private refreshOrderFiles(): void {
    if (this.bankInfoId && this.batch?.id) {
      this.store.dispatch(
        pollOrderFiles({ bankId: this.bankInfoId, batchId: this.batch.id })
      );
    }
  }

  private autoExpandFilesWithErrors(): void {
    this.orderFiles.forEach(orderFile => {
      if (this.hasValidationErrors(orderFile)) {
        this.expandedFiles.add(orderFile.id);
      }
    });
  }

  hasValidationErrors(orderFile: OrderFile): boolean {
    if (!orderFile.checkOrders || orderFile.checkOrders.length === 0) return false;
    return orderFile.checkOrders.some(checkOrder =>
      !checkOrder.isValid &&
      checkOrder.errorMessage &&
      checkOrder.errorMessage.trim() !== ''
    );
  }

  isFileExpanded(orderFileId: string): boolean {
    return this.expandedFiles.has(orderFileId);
  }

  toggleFileExpansion(orderFileId: string): void {
    if (this.expandedFiles.has(orderFileId)) {
      this.expandedFiles.delete(orderFileId);
    } else {
      this.expandedFiles.add(orderFileId);
    }
  }

  getSortedCheckOrders(checkOrders: CheckOrders[]): CheckOrders[] {
    if (!checkOrders || !Array.isArray(checkOrders) || checkOrders.length === 0) return [];
    return [...checkOrders].sort((a, b) => {
      if (!a || !b) return 0;
      const aHasError = a.isValid === false && a.errorMessage && a.errorMessage.trim() !== '';
      const bHasError = b.isValid === false && b.errorMessage && b.errorMessage.trim() !== '';
      if (aHasError && !bHasError) return -1;
      if (!aHasError && bHasError) return 1;
      const accountA = a.accountNumber || '';
      const accountB = b.accountNumber || '';
      return accountA.localeCompare(accountB);
    });
  }

  onEditCheckOrder(orderFileId: string, checkOrder: CheckOrders): void {
    this.selectedOrderFileId = orderFileId;
    this.selectedCheckOrder = { ...checkOrder };
    this.showCheckOrderModal = true;
  }

  onAddCheckOrder(orderFileId: string): void {
    this.selectedOrderFileId = orderFileId;
    this.selectedCheckOrder = null;
    this.showCheckOrderModal = true;
  }

  onSaveCheckOrder(checkOrderData: CheckOrders): void {
    console.log('Saving check order:', checkOrderData);
    console.log('Order File ID:', this.selectedOrderFileId);
    this.onCloseModal();
  }

  onCheckOrderSaveSuccess(): void {
    this.validateAll();
    this.onCloseModal();
  }

  onCloseModal(): void {
    this.showCheckOrderModal = false;
    this.selectedCheckOrder = null;
    this.selectedOrderFileId = '';
  }
}
