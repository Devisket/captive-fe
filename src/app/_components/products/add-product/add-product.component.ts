import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Bank } from '../../../_models/bank';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import {
  FormControl,
  NgForm,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../_services/product.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Store } from '@ngrx/store';
import {
  createProduct,
  updateProduct,
} from '../_store/products/products.actions';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  @ViewChild('addProductTypeForm') addProductTypeForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.addProductTypeForm?.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private config: DynamicDialogConfig,
    private store: Store,
    private ref: DynamicDialogRef
  ) {}

  bankService = inject(BanksService);
  productTypeService = inject(ProductService);

  formGroup: FormGroup = new FormGroup({
    productId: new FormControl(null, []),
    productName: new FormControl('', Validators.required),
    productSequence: new FormControl('', Validators.required),
  });

  bankInfos: Bank[] = [];
  bankInfo?: Bank;
  model: any = {};
  bankId: string = '';

  ngOnInit(): void {}

  onSaveProduct() {
    this.store.dispatch(
      createProduct({
        bankId: this.config.data.bankId,
        product: this.formGroup.value,
      })
    );
    this.onClose();
  }

  onClose() {
    this.ref.close();
  }
}
