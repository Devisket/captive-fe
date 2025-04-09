import { Component, inject, input, OnInit } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { Batch } from '../../../_models/batch';
import { ToastrService } from 'ngx-toastr';
import { BatchesService } from '../../../_services/batches.service';
import { DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [DatePipe, RouterLink, FormsModule, ButtonModule, TableModule],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.scss'
})
export class BatchListComponent implements OnInit{

  constructor(private router: Router) {}

  private batchServices = inject(BatchesService);
  bankInfo = input.required<Bank>();
  batches: Batch[] = [];
  batch?: Batch;
  toastr = inject(ToastrService);
  bankId = ""
  ngOnInit(): void 
  {    
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

  onAddBatch()
  {
    this.router.navigate(['/add-batch', this.bankId]);
  } 
}
