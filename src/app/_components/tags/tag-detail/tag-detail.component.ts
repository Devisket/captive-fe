import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
  DialogService,
} from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Tag } from '../../../_models/tag';
import {
  CreateTagMappingRequest,
  TagMapping,
  TagMappingViewData,
} from '../../../_models/tag-mapping';
import {
  CheckInventory,
  CheckInventoryViewData,
} from '../../../_models/check-inventory';
import { map, Subscription } from 'rxjs';
import {
  getTagMapping,
  getCheckInventory,
  addNewTagMapping,
  deleteTagMapping,
  deleteCheckInventory,
  setCheckInventoryActive,
} from '../_store/tag.actions';
import { TagFeature } from '../_store/tag.reducers';
import { SharedFeature } from '../../../_store/shared/shared.reducer';
import { BankValues } from '../../../_models/values/bankValues';
import { AddCheckInventoryComponent } from '../check-inventory/add-check-inventory/add-check-inventory.component';
import { ValuesDto } from '../../../_models/values/valuesDto';
import { MultiSelectModule } from 'primeng/multiselect';
import { ScrollerModule } from 'primeng/scroller';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-tag-detail',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TabViewModule,
    DropdownModule,
    FormsModule,
    MultiSelectModule,
    ScrollerModule,
    PaginatorModule,
    CheckboxModule,
  ],
  providers: [DialogService],
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss'],
})
export class TagDetailComponent implements OnInit, OnDestroy {
  tag: Tag;
  checkInventories: CheckInventoryViewData[] = [];
  subscription$ = new Subscription();
  bankInfoId: string = '';
  bankValues: BankValues | undefined;
  viewTagMappingData: TagMappingViewData[] = [];

  formCheckOptions: ValuesDto[] = [
    {
      id: 'Personal',
      value: 'Personal',
    },
    {
      id: 'Commercial',
      value: 'Commercial',
    },
  ];

  // New properties for tag mapping form
  selectedBranch: string[] = [];
  selectedProduct: string[] = [];
  selectedFormCheck: string[] = [];

  selectedBranchFilter: string[] = [];
  selectedProductFilter: string[] = [];
  selectedFormCheckFilter: string[] = [];

  branchSelectedAll: boolean = false;
  productSelectedAll: boolean = false;
  formCheckSelectedAll: boolean = false;

  branchSelectedAllFilter: boolean = false;
  productSelectedAllFilter: boolean = false;
  formCheckSelectedAllFilter: boolean = false;
  isRepeatingFilter: boolean = true;
  isActiveFilter: boolean = true;

  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

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
          this.store.dispatch(
            getCheckInventory({
              query: {
                tagId: this.tag.id!,
                currentPage: 1,
                pageSize: 10,
                isActive: true,
                isRepeating: true,
              },
            })
          );
        })
    );

    this.subscription$.add(
      this.store
        .select(TagFeature.selectTagMappings)
        .subscribe((tagMappings: TagMapping[]) => {
          this.viewTagMappingData = tagMappings.map((mapping) => {
            return {
              id: mapping.id,
              tagId: mapping.tagId,
              products:
                mapping.mappings?.productIds?.map((x) =>
                  this.getProductValues(x)
                ) || [],
              branches:
                mapping.mappings?.branchIds?.map((x) =>
                  this.getBranchValues(x)
                ) || [],
              formCheckTypes:
                mapping.mappings?.formCheckType?.map((x) =>
                  this.getFormCheckValues(x)
                ) || [],
            } as TagMappingViewData;
          });
        })
    );

    this.subscription$.add(
      this.store
        .select(TagFeature.selectCheckInventories)
        .subscribe((inventories) => {
          console.log(inventories);
          this.checkInventories = inventories.map((inventory) => {
            return {
              ...inventory,
              viewMappingData: {
                branches:
                  inventory.mappingData.branchIds?.map(
                    (x) => this.getBranchValues(x)!
                  ).sort((a, b) => a.localeCompare(b)) || [],
                products:
                  inventory.mappingData?.productIds?.map(
                    (x) => this.getProductValues(x)!
                  ).sort((a, b) => a.localeCompare(b)) || [],
                formCheckTypes: inventory.mappingData?.formCheckType?.map(
                  (x) => this.getFormCheckValues(x)!
                ) ?? ['Personal', 'Commercial'],
              },
            } as CheckInventoryViewData;
          });

          this.checkInventories.sort((a, b) => {
            const branchesA = a.viewMappingData?.branches || [];
            const branchesB = b.viewMappingData?.branches || [];
            return branchesA.length - branchesB.length;
          });
        })
    );

    this.subscription$.add(
      this.store
        .select(TagFeature.selectTotalRecords)
        .subscribe((totalRecords) => {
          this.totalRecords = totalRecords;
        })
    );
  }

  getBranchValues(branchId: string) {
    const branch = this.bankValues!.branchValues.find((b) => b.id === branchId);
    return branch?.value;
  }

  getProductValues(productId: string) {
    const product = this.bankValues!.productValues.find(
      (p) => p.id === productId
    );
    return product?.value;
  }

  getFormCheckValues(formCheckId: string) {
    console.log(formCheckId);
    const formCheck = this.formCheckOptions.find((f) => f.id === formCheckId);
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

    const tagMapping: CreateTagMappingRequest = {
      id: undefined,
      tagId: this.tag.id,
      branchIds: this.selectedBranch || undefined,
      productIds: this.selectedProduct || undefined,
      formCheckType: this.selectedFormCheck || undefined,
    };

    this.store.dispatch(
      addNewTagMapping({
        bankInfoId: this.bankInfoId,
        tagId: this.tag.id,
        tagMappings: tagMapping,
      })
    );

    // Reset form
    this.selectedBranch = [];
    this.selectedProduct = [];
    this.selectedFormCheck = [];
  }

  onDeleteTagMapping(tagMapping: TagMapping) {
    console.log(tagMapping);
    this.store.dispatch(
      deleteTagMapping({
        bankInfoId: this.bankInfoId,
        tagId: this.tag.id!,
        tagMappingId: tagMapping.id!,
      })
    );
  }

  showAddCheckInventoryDialog() {
    const ref = this.dialogService.open(AddCheckInventoryComponent, {
      header: 'Add Check Inventory',
      width: '50%',
      data: {
        tagId: this.tag.id,
        bankId: this.bankInfoId,
      },
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        // Refresh check inventories
        this.store.dispatch(
          getCheckInventory({
            query: {
              tagId: this.tag.id!,
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              isActive: true,
              isRepeating: true,
            },
          })
        );
      }
    });
  }

  initiateCheckInventory() {
    const ref = this.dialogService.open(AddCheckInventoryComponent, {
      header: 'Initiate Check Inventory',
      width: '50%',
      data: {
        tagId: this.tag.id,
        bankId: this.bankInfoId,
        initiateCheckInventory: true,
      },
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.tag.checkInventoryInitiated = true;
        // Refresh check inventories
        this.store.dispatch(
          getCheckInventory({
            query: {
              tagId: this.tag.id!,
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              isActive: true,
              isRepeating: true,
            },
          })
        );
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
        checkInventory: checkInventory,
      },
    });
  }

  onDeleteCheckInventory(checkInventory: CheckInventory) {
    this.store.dispatch(
      deleteCheckInventory({
        tagId: this.tag.id!,
        checkInventoryId: checkInventory.id!,
      })
    );
  }

  setCheckInventoryActive(checkInventory: CheckInventory) {
    this.store.dispatch(
      setCheckInventoryActive({
        tagId: this.tag.id!,
        checkInventoryId: checkInventory.id!,
      })
    );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  onBranchSelectAllChange(event: any) {
    this.selectedBranch = event.checked
      ? this.bankValues!.branchValues.map((b) => b.id)
      : [];
    this.branchSelectedAll = event.checked;
  }

  onProductSelectAllChange(event: any) {
    this.selectedProduct = event.checked
      ? this.bankValues!.productValues.map((p) => p.id)
      : [];
    this.productSelectedAll = event.checked;
  }

  onFormCheckSelectAllChange(event: any) {
    this.selectedFormCheck = event.checked
      ? this.formCheckOptions.map((f) => f.id)
      : [];
    this.formCheckSelectedAll = event.checked;
  }

  onBranchFilterSelectAllChange(event: any) {
    this.selectedBranchFilter = event.checked
      ? this.bankValues!.branchValues.map((b) => b.id)
      : [];
    this.branchSelectedAll = event.checked;
  }

  onProductFilterSelectAllChange(event: any) {
    this.selectedProductFilter = event.checked
      ? this.bankValues!.productValues.map((p) => p.id)
      : [];
    this.productSelectedAll = event.checked;
  }

  onFormCheckFilterSelectAllChange(event: any) {
    this.selectedFormCheckFilter = event.checked
      ? this.formCheckOptions.map((f) => f.id)
      : [];
    this.formCheckSelectedAll = event.checked;
  }

  

  canAddTagMapping(): boolean {
    return (
      this.selectedBranch.length > 0 &&
      this.selectedProduct.length > 0 &&
      this.selectedFormCheck.length > 0
    );
  }

  onPageChange(event: any) {
    this.store.dispatch(
      getCheckInventory({
        query: {
          tagId: this.tag.id!,
          currentPage: event.page + 1,
          pageSize: event.rows,
          isActive: this.isActiveFilter,
          isRepeating: this.isRepeatingFilter,
          branchIds: this.selectedBranchFilter ?? undefined,
          productIds: this.selectedProductFilter ?? undefined,
          formCheckType: this.selectedFormCheckFilter ?? undefined,
        },
      })
    );
  }

  onSearchCheckInventory() {
    this.store.dispatch(
      getCheckInventory({
        query: {
          tagId: this.tag.id!,
          currentPage: 1,
          pageSize: 10,
          isActive: this.isActiveFilter,
          isRepeating: this.isRepeatingFilter,
          branchIds: this.selectedBranchFilter ?? undefined,
          productIds: this.selectedProductFilter ?? undefined,
          formCheckType: this.selectedFormCheckFilter ?? undefined,
        },
      })
    );
  }

  onResetCheckInventory() {
    this.selectedBranchFilter = [];
    this.selectedProductFilter = [];
    this.selectedFormCheckFilter = [];
    this.isRepeatingFilter = true;
    this.isActiveFilter = true;
  } 
}
