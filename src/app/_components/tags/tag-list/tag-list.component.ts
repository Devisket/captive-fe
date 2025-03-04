import { NgIf, UpperCasePipe } from '@angular/common';
import { Component, inject, Input, input, OnInit } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { Tag } from '../../../_models/tag';
import { CheckValidationService } from '../../../_services/check-validation.service';
import { CheckValidation } from '../../../_models/check-validation';
import { TagMappingListComponent } from '../tag-mapping-list/tag-mapping-list.component';
import { TagsService } from '../../../_services/tags.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [NgIf, RouterLink, TagMappingListComponent, UpperCasePipe],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss'
})
export class TagListComponent implements OnInit{
  route = inject(ActivatedRoute);
  bankService = inject(BanksService);
  checkValidationService = inject(CheckValidationService);
  toastr = inject(ToastrService);
  tagsService = inject(TagsService);
  bankInfo?: Bank;
  visibleTagMapping: Set<string> = new Set();
  tags: Tag[] = [];
  checkValidation?: CheckValidation;

  ngOnInit(): void {
    this.loadBank();
    //this.getCheckValidations();
  }

  toggletagMappingVisibility(tagId: string): void {
    if (this.visibleTagMapping.has(tagId)) {
      this.visibleTagMapping.delete(tagId);
    } else {
      this.visibleTagMapping.add(tagId);
    }
  }

  isTagMappingVisible(tagId: string): boolean {
    return this.visibleTagMapping.has(tagId);
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!bankId) return;
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  // getCheckValidations(){
  //   let bankId = this.route.snapshot.paramMap.get("bankId");
  //   let checkValidationId = this.route.snapshot.paramMap.get("checkValidationId");
  //   this.checkValidationService.getCheckValidations(bankId).subscribe(data => {
  //     this.checkValidation = data.checkValidations.find((checkVal: CheckValidation) => checkVal.id === checkValidationId);
  //     if(!this.checkValidation) return;
  //     this.tags = this.checkValidation.tags;
  //   });
  // }


  // deleteTag(tagId: any, event: Event) {
  //   if (!confirm('Confirm Deletion!')) {
  //     event.preventDefault();
  //     return;
  //   }
  //   this.tagsService.deleteTag(this.bankInfo?.id, tagId).subscribe({
  //     error: (error) => {
  //       this.toastr.error(error.error);
  //       console.log(error.error);
  //     },
  //     next: (response) => {
  //       this.toastr.success('Successfully deleted bank.');
  //       this.tags = this.tags.filter(tag => tag.id !== tagId);
  //     },
  //   });
  // }
}
