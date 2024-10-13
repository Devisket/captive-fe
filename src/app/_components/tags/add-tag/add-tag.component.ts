import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Bank } from '../../../_models/bank';

@Component({
  selector: 'app-add-tag',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-tag.component.html',
  styleUrl: './add-tag.component.css'
})
export class AddTagComponent implements OnInit{


  @ViewChild('addTagForm') addTagForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.addTagForm?.dirty) {
      $event.returnValue = true;
    }
  }

  bankInfo?: Bank;
  model: any = {};

  ngOnInit(): void {
    
  }

  addTag() {
    // this.productTypeService.addProductType(this.addProductTypeForm?.value, this.bankInfo?.id).subscribe({
    //   next: _ => {
    //     this.toastr.success( this.bankInfo?.bankName + " product type has been added successsfully");
    //     this.router.navigateByUrl('/banks/' + this.bankInfo?.id);
    //   },
    //   error: error => this.toastr.error("Not saved")
    // })
  }

}
