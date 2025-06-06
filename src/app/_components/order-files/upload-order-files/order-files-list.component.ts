import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { BatchesService } from '../../../_services/batches.service';
import { Batch } from '../../../_models/batch';
import { FormsModule, NgForm } from '@angular/forms';
import { OrderFilesService } from '../../../_services/order-files.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { OrderFile } from '../../../_models/order-file';
import { HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckOrders } from '../../../_models/check-order';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { LogType } from '../../../_models/constants';
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
  processAllOrderFiles,
  uploadOrderFiles,
} from '../_store/order-file.actions';
import { OrderFileFeature } from '../_store/order-file.reducers';
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
    {
      columnName: 'Account Number',
      value: 'accountNumber',
    },
    {
      columnName: 'BRSTN',
      value: 'brstn',
    },
    {
      columnName: 'Name',
      value: 'mainAccountName',
    },
    {
      columnName: 'Quantity',
      value: 'quantity',
    },
    {
      columnName: 'Deliver To',
      value: 'deliverTo',
    },
    {
      columnName: 'Error Message',
      value: 'errorMessage',
    },
    {
      columnName: 'Action',
      value: '',
    },
  ];

  displayedColumns = [
    'accountNumber',
    'brstn',
    'quantity',
    'deliverTo',
    'error',
  ];

  dialogData = {
    dialogTitle: 'Warning',
    dialogType: LogType.Warning,
    dialogMessage: 'This is a warning message',
  };

  route = inject(ActivatedRoute);
  bankService = inject(BanksService);
  batchService = inject(BatchesService);
  orderFileService = inject(OrderFilesService);
  toastr = inject(ToastrService);
  config = inject(DynamicDialogConfig);
  batch?: Batch;
  model: any = {};
  selectedFiles: File[] = [];
  orderFiles: OrderFile[] = [];
  visibleBatches: Set<string> = new Set();
  private refreshInterval: any;
  $subscription = new Subscription();
  bankInfoId: string = '';

  visibleDialog: boolean = false;

  constructor(private store: Store) {
    if (this.config.data) {
      this.bankInfoId = this.config.data.bankId;
      this.batch = this.config.data.batch;
    }
  }

  errorMessage: string | undefined = undefined;

  ngOnInit(): void {
    this.store.dispatch(
      getOrderFiles({ bankId: this.bankInfoId, batchId: this.batch?.id! })
    );
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
      this.store
        .select(OrderFileFeature.selectOrderFiles)
        .subscribe((orderFiles) => {
          if (orderFiles && orderFiles.length > 0) {
            this.orderFiles = orderFiles.map((orderFile) => ({ ...orderFile }));
          } else {
            this.orderFiles = [];
          }
        })
    );

    // if (!this.batch) {
    //   const batchId = this.route.snapshot.paramMap.get('batchId')!;
    //   this.orderFileService.startConnection();
    //   this.batchService.startConnection(batchId);
    //   this.getBatch();
    // }
    // this.getOrderFiles();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.errorMessage = undefined;
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

    // this.orderFileService.processOrderFile(orderFileId).subscribe({
    //   next: (returnLog: any) => {
    //     this.toastr.success('Process successfully.');
    //     this.getOrderFiles();
    //     if (returnLog.logMessage !== '') {
    //       this.dialogData.dialogType = LogType.Warning;
    //       this.dialogData.dialogMessage = returnLog.logMessage;
    //       this.visibleDialog = true;
    //     }
    //   },
    //   error: (err) => {
    //     this.dialogData.dialogType = LogType.Error;
    //     this.dialogData.dialogMessage = err.error.message;
    //     this.visibleDialog = true;
    //   },
    // });
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
    // this.$subscription.add(
    //   this.orderFileService.deleteOrderFile(orderFileId).subscribe({
    //     next: (_) => {
    //       this.toastr.success('Successfully deleted order file');
    //     },
    //     error: (error) => this.toastr.error(`Error on deletion: ${error}`),
    //     complete: () => window.location.reload(),
    //   })
    // );

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


      // this.orderFileService.uploadOrderFiles(formData).subscribe({
            // next: (_) => {
            // this.toastr.success('Successfulyy uploaded new order files.');
      //   },
      //   error: (error) => this.toastr.error('Not saved'),
      //   complete: () => window.location.reload(),
      // });
    }
  }

  refreshView() {
    // Your logic to refresh the view
  }

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
            console.log(invalidCheckOrders);
            invalidCheckOrders.forEach((invalidCheckOrder: CheckOrders) => {
              this.dialogData.dialogType = LogType.Error;
              this.dialogData.dialogMessage =
                invalidCheckOrder.errorMessage ?? '';
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
    this.store.dispatch(processAllOrderFiles({ bankId: this.bankInfoId, batchId: this.batch!.id }));
  }

  validateAll() {
    this.orderFileService
      .validateAllOrderFiles(this.bankInfoId, this.batch!.id)
      .subscribe({
        next: (data) => {
          this.getOrderFiles();
        },
      });
  }
  canBeValidateByBatch(orderFiles: OrderFile[]): boolean {
    return (
      orderFiles.filter((x) => x.status !== 'Valid' && x.status !== 'Completed')
        .length > 0
    );
  }
  canBeProcessByBatch(orderFiles: OrderFile[]): boolean {
    return (
      orderFiles.filter((x) => x.status !== 'Valid' && x.status !== 'Completed')
        .length > 0
    );
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
    return this.orderFiles.every(file => file.status === 'Valid');
  }
}
