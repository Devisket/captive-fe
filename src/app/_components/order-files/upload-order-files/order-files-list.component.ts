import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { BatchesService } from '../../../_services/batches.service';
import { Batch } from '../../../_models/batch';
import { FormsModule, NgForm } from '@angular/forms';
import { OrderFilesService } from '../../../_services/order-files.service';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf } from '@angular/common';
import { OrderFile } from '../../../_models/order-file';
import { HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckOrders } from '../../../_models/check-order';
import { DialogModule } from 'primeng/dialog';
import { LogType } from '../../../_models/constants';

@Component({
  selector: 'app-order-file-list',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    RouterLink,
    TableModule,
    ButtonModule,
    DialogModule,
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
      columnName: 'Deliver To',
      value: 'deliverTo',
    },
    {
      columnName: 'Error Message',
      value: 'errorMessage',
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
  bankInfo?: Bank;
  batch?: Batch;
  model: any = {};
  selectedFiles: File[] = [];
  orderFiles: OrderFile[] = [];
  visibleBatches: Set<string> = new Set();
  private refreshInterval: any;
  $subscription = new Subscription();

  visibleDialog: boolean = false;

  ngOnInit(): void {
    const batchId = this.route.snapshot.paramMap.get('batchId')!;

    this.orderFileService.startConnection();
    this.batchService.startConnection(batchId);

    this.bankInfo;
    this.loadBank();
    this.getBatch();
    this.getOrderFiles();
    this.startRefreshing();
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get('bankId');
    if (!bankId) return;
    this.$subscription.add(
      this.bankService.getBanks().subscribe((data) => {
        this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
      })
    );
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

  onValidate(orderFileId: string): void {
    this.$subscription.add(
      this.orderFileService.validateOrderFile(orderFileId).subscribe((_) => {
        this.getOrderFiles();
      })
    );
  }

  onProcess(orderFileId: string): void {
    this.orderFileService.processOrderFile(orderFileId).subscribe({
      next: (returnLog: any) => {
        this.toastr.success('Process successfully.');
        this.getOrderFiles();
        if (returnLog.logMessage !== '') {
          this.dialogData.dialogType = LogType.Warning;
          this.dialogData.dialogMessage = returnLog.logMessage;
          this.visibleDialog = true;
        }
      },
      error: (err) => {
        this.dialogData.dialogType = LogType.Error;
        this.dialogData.dialogMessage = err.error.message;
        this.visibleDialog = true;
      },
    });
  }

  onDelete(orderFileId: string): void {
    this.$subscription.add(
      this.orderFileService.deleteOrderFile(orderFileId).subscribe({
        next: (_) => {
          this.toastr.success('Successfully deleted order file');
        },
        error: (error) => this.toastr.error(`Error on deletion: ${error}`),
        complete: () => window.location.reload(),
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
      if (this.bankInfo) {
        formData.append('bankId', this.bankInfo?.id);
      }
      if (this.batch) {
        formData.append('batchId', this.batch?.id);
      }

      this.orderFileService.uploadOrderFiles(formData).subscribe({
        next: (_) => {
          this.toastr.success('Successfulyy uploaded new order files.');
        },
        error: (error) => this.toastr.error('Not saved'),
        complete: () => window.location.reload(),
      });
    }
  }

  startRefreshing() {
    this.refreshInterval = setInterval(() => {
      this.getOrderFiles();
    }, 1000);
  }

  refreshView() {
    // Your logic to refresh the view
  }

  getOrderFiles() {
    const headers = new HttpHeaders().set('X-Skip-Spinner', 'true');
    let batchId = this.route.snapshot.paramMap.get('batchId');
    let bankId = this.route.snapshot.paramMap.get('bankId');

    this.orderFileService
      .getOrderFiles(bankId, batchId, headers)
      .subscribe((data) => {
        if (!data) return;
        if (!data.orderFiles) return;
        this.orderFiles = data.orderFiles.filter((orderFile: OrderFile) => {
          return orderFile.batchId === batchId;
        });

        this.orderFiles.forEach((orderFile: OrderFile) => {
          if (orderFile.status === 'Processing') {
            // Refresh the page or update the view
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
              this.dialogData.dialogMessage = invalidCheckOrder.errorMessage;
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

    return orderFile.checkOrders.some((x) => !x.isValid);
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
    // this.orderFileService.processAllOrderFiles(this.bankInfo?.id).subscribe({
    //   next: (_) => {
    //     this.toastr.success('Successfully processed all order files.');
    //   }
    // });
  }

  validateAll() {
    this.orderFileService
      .validateAllOrderFiles(this.bankInfo!.id, this.batch!.id)
      .subscribe({
        next: (data) => {
          this.getOrderFiles();
        },
      });
  }
  canBeValidateByBatch(orderFiles: OrderFile[]): boolean {
    return orderFiles.filter(x => x.status !== 'Valid' && x.status !== 'Completed').length > 0;
  }
  canBeProcessByBatch(orderFiles: OrderFile[]): boolean {
    return orderFiles.filter(x => x.status !== 'Valid' && x.status !== 'Completed').length > 0;
  }


  canBeValidate(orderFile: OrderFile): boolean {
    return orderFile.status !== 'Valid' && orderFile.status !== 'Completed';
  }

  canOrderFileBeProcess(orderFile: OrderFile): boolean {
    return orderFile.status === 'Valid';
  }

  orderFileIsValid(orderFile: OrderFile): boolean {
    return orderFile.status === 'Completed';
  }
}
