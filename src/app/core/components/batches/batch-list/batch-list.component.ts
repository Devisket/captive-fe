import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Batch } from '../../../../_models/batch';
import { BatchJob } from '../../../../_models/batch-job';
import { OrderFile } from '../../../../_models/order-file';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SharedFeature } from '../../../../shared/_store/shared.reducer';
import {
  createNewBatch,
  deleteBatch,
  getAllBatches,
  processBatch,
  pollBatchJob,
  confirmBatchProcess,
  cancelBatchProcess,
  clearBatchJob,
  pollBatchOrderFiles,
  updateOrderFileDetailForBatch,
} from '../../../store/batch/batch.actions';
import { BatchFeature } from '../../../store/batch/batch.reducer';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DateTransformPipe } from '../../../../shared/pipes/date-transform.pipe';
import { CreateBatchDialogComponent } from '../create-batch-dialog/create-batch-dialog.component';
import { OrderFilesService } from '../../../_services/order-files.service';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [FormsModule, ButtonModule, TableModule, ProgressBarModule, DialogModule, CommonModule, DateTransformPipe],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.scss',
  providers: [DialogService]
})
export class BatchListComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private dialogService: DialogService
  ) {}

  batches: Batch[] = [];
  toastr = inject(ToastrService);
  orderFilesService = inject(OrderFilesService);
  bankId: string = '';
  ref: DynamicDialogRef | undefined;

  // Batch job state
  jobs: Record<string, BatchJob> = {};
  orderFilesByBatch: Record<string, OrderFile[]> = {};
  showWarningDialog: boolean = false;
  activeWarningBatchId: string | null = null;
  private jobPollingIntervals: Record<string, any> = {};
  private signalRBatchIds = new Set<string>();

  subscriptions$ = new Subscription();

  ngOnInit(): void {
    this.subscriptions$.add(
      this.store
        .select(SharedFeature.selectSelectedBankInfoId)
        .subscribe((bankId) => {
          this.bankId = bankId ?? '';
        })
    );
    this.subscriptions$.add(
      this.store.select(BatchFeature.selectBatches).subscribe((batches) => {
        this.batches = batches;
      })
    );
    this.subscriptions$.add(
      this.store.select(BatchFeature.selectJobs).subscribe((jobs) => {
        this.jobs = jobs;
        Object.entries(jobs).forEach(([batchId, job]) => {
          if (job.status === 'Running' || job.status === 'Pending') {
            if (this.activeWarningBatchId === batchId) {
              this.showWarningDialog = false;
              this.activeWarningBatchId = null;
            }
            this.startJobPolling(batchId);
            this.ensureSignalRForBatch(batchId);
          } else {
            this.stopJobPolling(batchId);
            this.leaveSignalRForBatch(batchId);
            if (job.status === 'AwaitingConfirmation') {
              this.activeWarningBatchId = batchId;
              this.showWarningDialog = true;
            } else if (job.status === 'Completed') {
              this.store.dispatch(getAllBatches({ bankId: this.bankId }));
              this.store.dispatch(clearBatchJob({ batchId }));
            }
          }
        });
      })
    );

    this.subscriptions$.add(
      this.store.select(BatchFeature.selectOrderFilesByBatch).subscribe((orderFilesByBatch) => {
        this.orderFilesByBatch = orderFilesByBatch;
      })
    );

    this.subscriptions$.add(
      this.orderFilesService.orderFileStatus$.subscribe((orderFile) => {
        this.store.dispatch(updateOrderFileDetailForBatch({ batchId: orderFile.batchId, orderFile }));
      })
    );

    this.getBatches();
  }

  getBatches() {
    this.store.dispatch(getAllBatches({ bankId: this.bankId }));
  }

  onDeleteBatch(batchId: string) {
    this.store.dispatch(deleteBatch({ bankId: this.bankId, batchId }));
  }

  onAddBatch() {
    const dialogRef = this.dialogService.open(CreateBatchDialogComponent, {
      header: 'Create New Batch',
      width: '500px',
      height: 'auto',
    });

    dialogRef.onClose.subscribe((result: any) => {
      if (result) {
        this.store.dispatch(createNewBatch({
          bankId: this.bankId,
          date: result.deliveryDate,
          batchName: result.batchName || null
        }));
      }
    });
  }

  onProcessBatch(batchId: string) {
    this.store.dispatch(processBatch({ bankId: this.bankId, batchId }));
  }

  onConfirmBatchProcess() {
    this.showWarningDialog = false;
    if (this.activeWarningBatchId) {
      this.store.dispatch(confirmBatchProcess({ bankId: this.bankId, batchId: this.activeWarningBatchId }));
      this.activeWarningBatchId = null;
    }
  }

  onCancelBatchProcess() {
    this.showWarningDialog = false;
    if (this.activeWarningBatchId) {
      this.store.dispatch(cancelBatchProcess({ bankId: this.bankId, batchId: this.activeWarningBatchId }));
      this.activeWarningBatchId = null;
    }
  }

  getJobForBatch(batchId: string): BatchJob | null {
    return this.jobs[batchId] ?? null;
  }

  isBatchProcessing(batchId: string): boolean {
    const job = this.jobs[batchId];
    return !!job && (job.status === 'Pending' || job.status === 'Running');
  }

  canProcessBatch(batch: Batch): boolean {
    return batch.batchFileStatus === 'Pending' && !this.isBatchProcessing(batch.id);
  }

  get activeWarningJob(): BatchJob | null {
    return this.activeWarningBatchId ? (this.jobs[this.activeWarningBatchId] ?? null) : null;
  }

  showBatchDetail(batch: Batch) {
    this.router.navigate(['../batch-detail', batch.id], { relativeTo: this.route });
  }

  getOrderFilesForBatch(batchId: string): OrderFile[] {
    return this.orderFilesByBatch[batchId] ?? [];
  }

  private startJobPolling(batchId: string) {
    if (this.jobPollingIntervals[batchId]) return;
    this.jobPollingIntervals[batchId] = setInterval(() => {
      this.store.dispatch(pollBatchJob({ bankId: this.bankId, batchId }));
      this.store.dispatch(pollBatchOrderFiles({ bankId: this.bankId, batchId }));
    }, 3000);
  }

  private stopJobPolling(batchId: string) {
    if (this.jobPollingIntervals[batchId]) {
      clearInterval(this.jobPollingIntervals[batchId]);
      delete this.jobPollingIntervals[batchId];
    }
  }

  private ensureSignalRForBatch(batchId: string) {
    if (this.signalRBatchIds.has(batchId)) return;
    this.signalRBatchIds.add(batchId);
    this.orderFilesService.startConnection(batchId);
  }

  private leaveSignalRForBatch(batchId: string) {
    if (!this.signalRBatchIds.has(batchId)) return;
    this.signalRBatchIds.delete(batchId);
    this.orderFilesService.leaveBatchGroup(batchId);
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
    Object.keys(this.jobPollingIntervals).forEach((id) => this.stopJobPolling(id));
    this.signalRBatchIds.forEach((id) => this.orderFilesService.leaveBatchGroup(id));
    this.orderFilesService.stopConnection();
    this.subscriptions$.unsubscribe();
  }
}
