import { Component, inject, input, OnInit } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { Batch } from '../../../_models/batch';
import { ToastrService } from 'ngx-toastr';
import { BatchesService } from '../../../_services/batches.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [DatePipe, RouterLink, FormsModule],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.scss'
})
export class BatchListComponent implements OnInit{

  private batchServices = inject(BatchesService);
  bankInfo = input.required<Bank>();
  batches: Batch[] = [];
  batch?: Batch;
  toastr = inject(ToastrService);
  bankId = ""
  ngOnInit(): void 
  {
    this.bankInfo;
    this.bankId = this.bankInfo().id;
    this.getBatches();    
  }

  getBatches(){    
    this.batchServices.getBatches(this.bankId).subscribe(data => {
      if(!data) return;
      this.batches = data.batchFiles;
    });
  }

  onDeleteBatch(batchId:string) 
  {
    this.batchServices.deleteBatch(this.bankId, batchId).subscribe(data => {
      this.getBatches();
    })
  }
}
