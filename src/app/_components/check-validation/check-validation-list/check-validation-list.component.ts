import { Component, input, OnInit } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-check-validation-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './check-validation-list.component.html',
  styleUrl: './check-validation-list.component.css'
})
export class CheckValidationListComponent implements OnInit{

  bankInfo = input.required<Bank>();

  ngOnInit(): void {

  }
}
