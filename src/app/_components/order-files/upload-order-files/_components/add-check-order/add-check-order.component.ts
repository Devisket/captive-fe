import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { DialogModule } from "primeng/dialog";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"; 
import { Store } from "@ngrx/store";
import { CheckOrders } from "../../../../../_models/check-order";
import { saveCheckOrder } from "../../../_store/check-order.actions";
import { CheckOrderFeature } from "../../../_store/check-order.reducers";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-add-check-order',
  templateUrl: './add-check-order.component.html',
  styleUrls: ['./add-check-order.component.scss'],
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    DialogModule,
    ReactiveFormsModule,
  ],
})
export class AddCheckOrderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() visible: boolean = false;
  @Input() checkOrder: CheckOrders | null = null;
  @Input() bankId: string = '';
  @Input() batchId: string = '';
  @Input() orderFileId: string = '';
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CheckOrders>();
  @Output() cancel = new EventEmitter<void>();
  @Output() saveSuccess = new EventEmitter<void>();

  private subscription = new Subscription();

  formGroup = new FormGroup({
    id: new FormControl(''),
    accountNumber: new FormControl('', Validators.required),
    brstn: new FormControl('', Validators.required), 
    quantity: new FormControl(''),
    deliverTo: new FormControl(''),
    mainAccountName: new FormControl(''),
    checkType: new FormControl(''),
    formType: new FormControl(''),
    branchCode: new FormControl(''),
    concode: new FormControl(''),
    startingSeries: new FormControl(''),
    endingSeries: new FormControl(''),
    accountName1: new FormControl(''),
    accountName2: new FormControl(''),
  });

  dialogTitle: string = 'Add Check Order';
  isEditMode: boolean = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    if (this.checkOrder) {
      this.isEditMode = true;
      this.dialogTitle = 'Edit Check Order';
      this.populateForm();
    } else {
      this.isEditMode = false;
      this.dialogTitle = 'Add Check Order';
      this.resetForm();
    }

    this.subscription.add(
      this.store.select(CheckOrderFeature.selectLoading).subscribe(loading => {
        // Handle loading state if needed
      })
    );

    this.subscription.add(
      this.store.select(CheckOrderFeature.selectLastSavedResponse).subscribe(response => {
        if (response) {
          this.saveSuccess.emit();
          this.onHide();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.visible) {
      if (this.checkOrder) {
        this.isEditMode = true;
        this.dialogTitle = 'Edit Check Order';
        this.populateForm();
      } else {
        this.isEditMode = false;
        this.dialogTitle = 'Add Check Order';
        this.resetForm();
      }
    }
  }

  private populateForm(): void {
    if (this.checkOrder) {
      console.log(this.checkOrder);
      this.formGroup.patchValue({
        id: this.checkOrder.id,
        accountNumber: this.checkOrder.accountNumber,
        brstn: this.checkOrder.brstn,
        quantity: this.checkOrder.quantity ?? null,
        deliverTo: this.checkOrder.deliverTo,
        mainAccountName: this.checkOrder.mainAccountName,
        checkType: this.checkOrder.checkType,
        formType: this.checkOrder.formType,
        branchCode: this.checkOrder.branchCode,
        concode: this.checkOrder.concode,
        startingSeries: this.checkOrder.startingSeries,
        endingSeries: this.checkOrder.endingSeries,
        accountName1: this.checkOrder.accountName1,
        accountName2: this.checkOrder.accountName2,
      });
    }
  }

  private resetForm(): void {
    this.formGroup.reset();
    this.formGroup.patchValue({
      id: '',
      accountNumber: '',
      brstn: '',
      quantity: null,
      deliverTo: '',
      mainAccountName: '',
      checkType: '',
      formType: '',
      branchCode: '',
      concode: '',
      startingSeries: '',
      endingSeries: '',
      accountName1: '',
      accountName2: '',
    });
  }

  onSave(): void {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      const checkOrderData: CheckOrders = {
        id: formValue.id || undefined,
        accountNumber: formValue.accountNumber || '',
        brstn: formValue.brstn || '',
        quantity: formValue.quantity || undefined,
        deliverTo: formValue.deliverTo || undefined,
        mainAccountName: formValue.mainAccountName || undefined,
        checkType: formValue.checkType || undefined,
        formType: formValue.formType || undefined,
        branchCode: formValue.branchCode || undefined,
        concode: formValue.concode || undefined,
        startingSeries: formValue.startingSeries || undefined,
        endingSeries: formValue.endingSeries || undefined,
        accountName1: formValue.accountName1 || undefined,
        accountName2: formValue.accountName2 || undefined,
        isOnHold: this.checkOrder?.isOnHold || false,
        isValid: this.checkOrder?.isValid || true,
        barcodeValue: this.checkOrder?.barcodeValue || undefined,
        errorMessage: this.checkOrder?.errorMessage || undefined
      };
      
      // Dispatch the action to save the check order
      this.store.dispatch(saveCheckOrder({
        checkOrder: checkOrderData,
        bankId: this.bankId,
        batchId: this.batchId,
        orderFileId: this.orderFileId
      }));
      
      // Also emit to parent for backward compatibility
      //this.save.emit(checkOrderData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.onHide();
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
