import { NgIf, UpperCasePipe } from '@angular/common';
import { Component, inject, Input, input, OnInit } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { Tag } from '../../../_models/tag';
import { CheckValidationService } from '../../../_services/check-validation.service';
import { CheckValidation } from '../../../_models/check-validation';
import { TagMappingListComponent } from '../tag-mapping-list/tag-mapping-list.component';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [NgIf, RouterLink, TagMappingListComponent, UpperCasePipe],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css'
})
export class TagListComponent implements OnInit{
  route = inject(ActivatedRoute);
  bankService = inject(BanksService);
  checkValidationService = inject(CheckValidationService);
  bankInfo?: Bank;
  visibleTagMapping: Set<string> = new Set();
  tags: Tag[] = [];

  ngOnInit(): void {
    this.loadBank();
    this.getCheckValidations();
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

  getCheckValidations(){
    let bankId = this.route.snapshot.paramMap.get("bankId");
    let checkValidationId = this.route.snapshot.paramMap.get("checkValidationId");
    this.checkValidationService.getCheckValidations(bankId).subscribe(data => {
      const checkValidation = data.checkValidations.find((checkVal: CheckValidation) => checkVal.id === checkValidationId);
      this.tags = checkValidation.tags;
    });
  }
}
