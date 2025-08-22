import { Component, inject, input, OnInit } from '@angular/core';
import { Bank } from '../../../../_models/bank';
import { Batch } from '../../../../_models/batch';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SharedFeature } from '../../../../shared/_store/shared.reducer';
import {
  createNewBatch,
  deleteBatch,
  getAllBatches,
} from '../../../store/batch/batch.actions';
import { BatchFeature } from '../../../store/batch/batch.reducer';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadOrderFilesComponent } from '../../order-files/upload-order-files/order-files-list.component';
import { DateSelectorComponent } from '../../../../shared/components/date-selector/date-selector.component';
import { DateTransformPipe } from '../../../../shared/pipes/date-transform.pipe';
import { CreateBatchDialogComponent } from '../create-batch-dialog/create-batch-dialog.component';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [FormsModule, ButtonModule, TableModule, DateTransformPipe],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.scss',
  providers: [DialogService]
})
export class BatchListComponent implements OnInit {
  constructor(
    private router: Router, 
    private store: Store,
    private dialogService: DialogService
  ) {}

  batches: Batch[] = [];
  toastr = inject(ToastrService);
  bankId: string = ' ';
  ref: DynamicDialogRef | undefined;

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

    this.getBatches();
  }

  getBatches() {
    this.store.dispatch(getAllBatches({ bankId: this.bankId }));
  }

  onDeleteBatch(batchId: string) {
    this.store.dispatch(deleteBatch({ bankId: this.bankId, batchId: batchId }));
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

  showBatchDetail(batch: Batch) {
    console.log(batch);
    this.ref = this.dialogService.open(UploadOrderFilesComponent, {
      header: `Batch Details - ${batch.batchName}`,
      width: '90%',
      height: '90%',
      data: {
        batch: batch,
        bankId: this.bankId
      }
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
    this.subscriptions$.unsubscribe();
  }
}
