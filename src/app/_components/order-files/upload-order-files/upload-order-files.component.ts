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

@Component({
  selector: 'app-upload-order-files',
  standalone: true,
  imports: [FormsModule, DatePipe, NgFor, NgIf, RouterLink],
  templateUrl: './upload-order-files.component.html',
  styleUrl: './upload-order-files.component.css'
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

  ngOnInit(): void {
    this.bankInfo;
    this.loadBank();
    this.getBatch();
    this.getOrderFiles();
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

  getOrderFiles(){
    let batchId = this.route.snapshot.paramMap.get("batchId");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    this.orderFileService.getOrderFiles(bankId, batchId).subscribe( data => {
      this.orderFiles = data.orderFiles.filter((orderFile: OrderFile) => orderFile.batchId === batchId);
      console.log(batchId, this.orderFiles, data.orderFiles);
    })
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
