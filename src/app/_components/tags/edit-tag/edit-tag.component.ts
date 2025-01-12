import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TagsService } from '../../../_services/tags.service';
import { BanksService } from '../../../_services/banks.service';
import { CheckValidationService } from '../../../_services/check-validation.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Bank } from '../../../_models/bank';
import { Tag } from '../../../_models/tag';

@Component({
  selector: 'app-edit-tag',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-tag.component.html',
  styleUrl: './edit-tag.component.scss'
})
export class EditTagComponent {
  @ViewChild('editTagForm') editTagForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.editTagForm?.dirty) {
      $event.returnValue = true;
    }
  }

  tagServices = inject(TagsService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router)
  tag?: Tag;
  checkValidationId = this.route.snapshot.paramMap.get("checkValidationId");
  bankId = this.route.snapshot.paramMap.get("bankId");
  tagId = this.route.snapshot.paramMap.get("tagId");

  ngOnInit(): void {
    this.loadTag();
    console.log(this.tagId, this.checkValidationId);
  }

  loadTag() {
    this.tagServices.getTag(this.bankId, this.tagId).subscribe(data => {
      this.tag = data;
    });
  }


  editTag() {
    const formData = this.editTagForm?.value;
    this.tagServices.updateTag(this.bankId, this.tag?.id, formData).subscribe({
      next: _ => {
        // this.toastr.success( formData.tagName + " tag has been updated successsfully");
        this.toastr.info( " Database not updated, API ISSUE");
      },
      error: error => this.toastr.error(error),
      complete: () => this.router.navigateByUrl('/tag-list/' + this.checkValidationId + '/bank/' + this.bankId)
    })
  }
}
