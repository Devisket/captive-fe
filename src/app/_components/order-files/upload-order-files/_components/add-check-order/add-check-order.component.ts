import { Component, OnInit } from "@angular/core";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"; 
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-add-check-order',
  templateUrl: './add-check-order.component.html',
  styleUrls: ['./add-check-order.component.scss'],
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
})
export class AddCheckOrderComponent implements OnInit {

  constructor(private store: Store) {

  }
  formGroup = new FormGroup({
    id: new FormControl(null, []),
    accountNumber: new FormControl('', Validators.required),
    brstn: new FormControl('', Validators.required), 
    mainAccountName: new FormControl('', Validators.required),
    quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
    deliverTo: new FormControl('', Validators.required)
  });

  bankId: string = '';
  batchId: string = '';

  ngOnInit(): void {
    
  }
}
