import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { BatchesService } from '../../../_services/batches.service';
import { Batch } from '../../../_models/batch';
import { FormsModule, NgForm } from '@angular/forms';
import { OrderFilesService } from '../../../_services/order-files.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { OrderFile } from '../../../_models/order-file';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-order-file-list',
  standalone: true,
  imports: [FormsModule, DatePipe, NgFor, NgIf, RouterLink],
  templateUrl: './order-files-list.component.html',
  styleUrl: './order-files-list.component.scss'
})
export class UploadOrderFilesComponent implements OnInit{

  @ViewChild('uploadOrderFileForm') uploadOrderFileForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.uploadOrderFileForm?.dirty) {
      $event.returnValue = true;
    }
  }

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

  ngOnInit(): void {
    this.bankInfo;
    this.loadBank();
    this.getBatch();
    this.getOrderFiles();
    this.startRefreshing();
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!bankId) return;
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  getBatch(){
    let batchId = this.route.snapshot.paramMap.get("batchId");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    this.batchService.getBatches(bankId).subscribe( data => {
      this.batch = data.batchFiles.find((batch: Batch) => batch.id === batchId);
    })
  }


  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  uploadOrderFile(): void {
    if (this.selectedFiles.length > 0) {

      const formData: FormData = new FormData();
      this.selectedFiles.forEach(file => {
        formData.append('files', file, file.name);
      });
      if(this.bankInfo){
        formData.append('bankId', this.bankInfo?.id);
      }
      if(this.batch){
        formData.append('batchId', this.batch?.id);
      }

      this.orderFileService.uploadOrderFiles(formData).subscribe({
        next: _ => {
          this.toastr.success("Successfulyy uploaded new order files.");
        },
        error: error => this.toastr.error("Not saved"),
        complete: () => window.location.reload()
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
      let batchId = this.route.snapshot.paramMap.get("batchId");
      let bankId = this.route.snapshot.paramMap.get("bankId");

      this.orderFileService.getOrderFiles(bankId, batchId, headers).subscribe( data => {
        if(!data) return;
        if(!data.orderFiles) return;
        this.orderFiles = data.orderFiles.filter((orderFile: OrderFile) => {
          return orderFile.batchId === batchId;
        });
        
        this.orderFiles.forEach((orderFile: OrderFile) => {
            if (orderFile.status === 'Processing') {
              // Refresh the page or update the view
              this.refreshView();
            } else {
              // Stop the interval if the status is not 'processing'
                clearInterval(this.refreshInterval);
            }
        });

        // console.log(this.orderFiles)
    });
  }

  toggleBatchVisibility(batchName: string): void {
    if (this.visibleBatches.has(batchName)) {
      this.visibleBatches.delete(batchName);
    } else {
      this.visibleBatches.add(batchName);
    }
  }

  isBatchVisible(batchName: string): boolean {
    return this.visibleBatches.has(batchName);
  }
}
