import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tag } from '../../../_models/tag';
import { Store } from '@ngrx/store';
import { SharedFeature } from '../../../_store/shared/shared.reducer';
import { Subscription } from 'rxjs';
import { getTags, updateTag, addNewTag, deleteTag } from '../_store/tag.actions';
import { TagFeature } from '../_store/tag.reducers';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [
    TableModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss',
})
export class TagListComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store, 
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  subscription$: Subscription = new Subscription();
  tags: Tag[] = [];
  clonedTag: { [key: string]: Tag } = {};
  bankInfoId: string = '';
  displayAddDialog: boolean = false;
  newTag: Tag = this.getEmptyTag();

  getEmptyTag(): Tag {
    return {
      id: undefined,
      tagName: '',
      isDefaultTag: false,
      searchByBranch: false,
      searchByAccount: false,
      searchByFormCheck: false,
      searchByProduct: false,
    };
  }

  showAddDialog() {
    this.displayAddDialog = true;
    this.newTag = this.getEmptyTag();
  }

  hideAddDialog() {
    this.displayAddDialog = false;
  }

  saveNewTag() {
    if (!this.newTag.tagName.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Tag name is required'
      });
      return;
    }

    this.store.dispatch(addNewTag({ 
      bankInfoId: this.bankInfoId, 
      tag: this.newTag 
    }));
    this.hideAddDialog();
  }

  onRowEditInit(tag: Tag) {
    this.clonedTag[tag.id!] = { ...tag };
  }

  onRowEditSave(tag: Tag) {
    // Here you would typically dispatch an action to update the tag
    console.log('Saving tag:', tag);

    if (tag.isDefaultTag) {
      const existingDefaultTag = this.tags.find(
        (t) => t.id !== tag.id && t.isDefaultTag
      );
      if (existingDefaultTag) {
        // Reset the current tag since we already have a default
        tag.isDefaultTag = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Another tag is already set as default',
        });
        return;
      }
    }

    this.store.dispatch(
      updateTag({ bankInfoId: this.bankInfoId, tagId: tag.id!, tag })
    );

    delete this.clonedTag[tag.id!];
  }

  onRowEditCancel(tag: Tag) {
    this.tags[this.findTagIndex(tag)] = this.clonedTag  [tag.id!];
    delete this.clonedTag[tag.id!];
  }

  private findTagIndex(tag: Tag): number {
    return this.tags.findIndex((t) => t.id === tag.id);
  }

  // Add method to handle checkbox changes
  onSearchOptionChange(tag: Tag, field: keyof Tag) {
    // Here you would typically dispatch an action to update the tag
    console.log('Tag updated:', tag);
  }

  ngOnInit(): void {
    this.subscription$.add(
      this.store
        .select(SharedFeature.selectSelectedBankInfoId)
        .subscribe((bankInfoId) => {
          if (!bankInfoId) return;
          this.bankInfoId = bankInfoId;
          this.store.dispatch(getTags({ bankInfoId }));
        })
    );

    this.subscription$.add(
      this.store.select(TagFeature.selectTags).subscribe((tags) => {
        console.log(tags);
        this.tags = tags.map((tag) => ({ ...tag }));
      })
    );
  }

  onDeleteTag(tag: Tag) {
    this.store.dispatch(deleteTag({ bankInfoId: this.bankInfoId, tagId: tag.id! }));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
