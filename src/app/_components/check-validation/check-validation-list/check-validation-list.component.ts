import { Component, inject, input, OnInit } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { RouterLink } from '@angular/router';
import { CheckValidation } from '../../../_models/check-validation';
import { CheckValidationService } from '../../../_services/check-validation.service';
import { EnumsService } from '../../../_services/enums.service';

@Component({
  selector: 'app-check-validation-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './check-validation-list.component.html',
  styleUrl: './check-validation-list.component.scss'
})
export class CheckValidationListComponent implements OnInit{
  bankInfo = input.required<Bank>();
  checkValidations: CheckValidation[] = [];
  checkValidationService = inject(CheckValidationService);
  enums = inject(EnumsService);
  validationTypes: any = [];

  ngOnInit(): void {
    this.getCheckValidations();
    this.getValidationTypes();
  }

  getCheckValidations(){
    this.checkValidationService.getCheckValidations(this.bankInfo().id).subscribe(data => {
      this.checkValidations = data.checkValidations;
    });
  }

  getValidationTypes(){
    this.validationTypes = this.enums.validationType();
  }
}
