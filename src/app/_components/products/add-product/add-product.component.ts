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
import { FormControl, NgForm, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../_services/product.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Store } from '@ngrx/store';
import { createProduct } from '../products.actions';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [RouterLink, InputTextModule, FloatLabelModule, ReactiveFormsModule],
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
    private store: Store,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  bankService = inject(BanksService);
  productTypeService = inject(ProductService);

  fg = new FormGroup({
    productName: new FormControl('', Validators.required),
  });

  bankInfos: Bank[] = [];
  bankInfo?: Bank;
  model: any = {};

  ngOnInit(): void {
    this.loadBank();
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get('id');
    if (!bankId) return;
    this.bankService.getBanks().subscribe((data) => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }

  get productNameFormControl() {
    return this.fg.get('productName') as FormControl;
  }

  onSubmit() {
    console.log(this.fg.valid);
    if (this.fg.valid) {
      this.store.dispatch(
        createProduct({
          bankInfoId: this.bankInfo!.id,
          productName: this.productNameFormControl.value,
        })
      );
    }
  }
}
