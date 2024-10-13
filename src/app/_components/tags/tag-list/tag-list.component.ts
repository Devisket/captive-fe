import { NgIf } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css'
})
export class TagListComponent implements OnInit{

  route = inject(ActivatedRoute);
  bankService = inject(BanksService);
  bankInfo?: Bank;
  visibleTagMapping: Set<string> = new Set();
  tagId = "tag-id";

  ngOnInit(): void {
    this.loadBank();
    this.tagId;
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
}
