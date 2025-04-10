import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Tag } from '../../../_models/tag';
import { TagMapping } from '../../../_models/tag-mapping';
import { CheckInventory } from '../../../_models/check-inventory';
import { Subscription } from 'rxjs';
import { getTagMapping, getCheckInventory, addNewTagMapping, deleteTagMapping, deleteCheckInventory } from '../_store/tag.actions';
import { TagFeature } from '../_store/tag.reducers';
import { SharedFeature } from '../../../_store/shared/shared.reducer';
import { BankValues } from '../../../_models/values/bankValues';
import { AddCheckInventoryComponent } from '../check-inventory/add-check-inventory/add-check-inventory.component';

@Component({
  selector: 'app-tag-detail',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TabViewModule,
    DropdownModule,
    FormsModule
  ],
  providers: [DialogService],
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss']
})
export class TagDetailComponent implements OnInit, OnDestroy {
  tag: Tag;
  tagMappings: TagMapping[] = [];
  checkInventories: CheckInventory[] = [];
  subscription$ = new Subscription();
  bankInfoId: string = '';
  bankValues: BankValues | undefined;

  // New properties for tag mapping form
  selectedBranch: any = null;
  selectedProduct: any = null;
  selectedFormCheck: any = null;

  constructor(
    private store: Store, 
    private config: DynamicDialogConfig,
    private dialogService: DialogService
  ) {
    this.tag = this.config.data.tag;
    this.bankInfoId = this.config.data.bankInfoId;
  }

  ngOnInit() {
    this.subscription$.add(
      this.store
        .select(SharedFeature.selectBankValues)
        .subscribe((bankValues) => {
          this.bankValues = bankValues;
          this.store.dispatch(
            getTagMapping({ bankInfoId: this.bankInfoId, tagId: this.tag.id! })
          );
          this.store.dispatch(getCheckInventory({ tagId: this.tag.id! }));
        })
    );

    this.subscription$.add(
      this.store.select(TagFeature.selectTagMappings).subscribe((mappings) => {
        console.log('Received tag mappings:', mappings);

        this.tagMappings = mappings.map((mapping) => {
          return {
            ...mapping,
            branchName: this.getBranchValues(mapping.branchId || ''),
            productName: this.getProductValues(mapping.productId || ''),
            formCheckName: this.getFormCheckValues(mapping.formCheckId || ''),
          };
        });
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

  getBranchValues(branchId: string) {
    const branch = this.bankValues?.branchValues.find((b) => b.id === branchId);
    return branch?.value;
  }

  getProductValues(productId: string) {
    const product = this.bankValues?.productValues.find(
      (p) => p.id === productId
    );
    return product?.value;
  }

  getFormCheckValues(formCheckId: string) {
    const formCheck = this.bankValues?.formCheckValues.find(
      (f) => f.id === formCheckId
    );
    return formCheck?.value;
  }

  isFormValid(): boolean {
    // Check if at least one field is filled based on tag settings
    if (this.tag.searchByBranch && this.selectedBranch) return true;
    if (this.tag.searchByProduct && this.selectedProduct) return true;
    if (this.tag.searchByFormCheck && this.selectedFormCheck) return true;
    return false;
  }

  onAddTagMapping() {
    if (!this.bankInfoId || !this.tag.id) return;

    console.log(this.selectedBranch);
    console.log(this.selectedFormCheck);

    const tagMapping: TagMapping = {
      id: undefined,
      tagId: this.tag.id,
      branchId: this.selectedBranch || undefined,
      productId: this.selectedProduct || undefined,
      formCheckId: this.selectedFormCheck || undefined,
    };

    this.store.dispatch(addNewTagMapping({ 
      bankInfoId: this.bankInfoId, 
      tagId: this.tag.id, 
      tagMappings: [tagMapping] 
    }));

    // Reset form
    this.selectedBranch = null;
    this.selectedProduct = null;
    this.selectedFormCheck = null;
  }

  onDeleteTagMapping(tagMapping: TagMapping) {
    this.store.dispatch(deleteTagMapping({ 
      bankInfoId: this.bankInfoId, 
      tagId: this.tag.id!, 
      tagMappingId: tagMapping.id!
    }));
  }

  showAddCheckInventoryDialog() {
    const ref = this.dialogService.open(AddCheckInventoryComponent, {
      header: 'Add Check Inventory',
      width: '50%',
      data: {
        tagId: this.tag.id,
        bankId: this.bankInfoId
      }
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        // Refresh check inventories
        this.store.dispatch(getCheckInventory({ tagId: this.tag.id! }));
      }
    });
  }

  showEditCheckInventoryDialog(checkInventory: CheckInventory) {
    const ref = this.dialogService.open(AddCheckInventoryComponent, {
      header: 'Edit Check Inventory',
      width: '50%',
      data: {
        tagId: this.tag.id,
        bankId: this.bankInfoId,
        checkInventory: checkInventory
      }
    });
  }

  onDeleteCheckInventory(checkInventory: CheckInventory) {
    this.store.dispatch(deleteCheckInventory({ 
      tagId: this.tag.id!, 
      checkInventoryId: checkInventory.id! 
    }));
  }
  
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
