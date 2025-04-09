import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { Tag } from '../../../_models/tag';
import { TagMapping } from '../../../_models/tag-mapping';
import { CheckInventory } from '../../../_models/check-inventory';
import { Subscription } from 'rxjs';
import { getTagMapping, getCheckInventory } from '../_store/tag.actions';
import { TagFeature } from '../_store/tag.reducers';
import { SharedFeature } from '../../../_store/shared/shared.reducer';

@Component({
  selector: 'app-tag-detail',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TabViewModule],
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss'],
})
export class TagDetailComponent implements OnInit, OnDestroy {
  tag: Tag;
  tagMappings: TagMapping[] = [];
  checkInventories: CheckInventory[] = [];
  subscription$ = new Subscription();
  bankInfoId: string = '';

  constructor(private store: Store, private config: DynamicDialogConfig) {
    this.tag = this.config.data.tag;
    console.log('Tag received in detail component:', this.tag);
  }

  ngOnInit() {
    this.subscription$.add(
      this.store
        .select(SharedFeature.selectSelectedBankInfoId)
        .subscribe((bankInfoId) => {
          console.log('Bank Info ID:', bankInfoId);
          if (bankInfoId) {
            this.bankInfoId = bankInfoId;
            console.log('Dispatching getTagMapping with:', {
              bankInfoId,
              tagId: this.tag.id,
            });
            this.store.dispatch(
              getTagMapping({ bankInfoId, tagId: this.tag.id! })
            );
            this.store.dispatch(getCheckInventory({ tagId: this.tag.id! }));
          }
        })
    );

    this.subscription$.add(
      this.store.select(TagFeature.selectTagMappings).subscribe((mappings) => {
        console.log('Raw tag mappings response:', mappings);
        if (mappings && typeof mappings === 'object') {
          console.log('Tag mappings structure:', Object.keys(mappings));
          // Check if mappings is nested inside a property
          const mappingsArray = Array.isArray(mappings)
            ? mappings
            : (mappings as any).tagMappings ||
              (mappings as any).items ||
              (mappings as any).data ||
              Object.values(mappings);
          console.log('Processed mappings array:', mappingsArray);
          this.tagMappings = mappingsArray;
        }
      })
    );

    this.subscription$.add(
      this.store
        .select(TagFeature.selectCheckInventories)
        .subscribe((inventories) => {
          console.log('Received check inventories:', inventories);
          this.checkInventories = inventories;
        })
    );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
