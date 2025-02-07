import { Component, OnInit } from '@angular/core';
import { CheckInventory } from '../../../_models/check-inventory';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'check-inventory-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './check-inventory-list.component.html',
  styleUrl: './check-inventory-list.component.scss',
})
export class CheckInventoryListComponent implements OnInit {
  displayedColumns = [
    'seriesPattern',
    'warningSeries',
    'numberOfPadding',
    'startingSeries',
    'isRepeating',
    'product',
    'tag',
  ];
  checkInventories: CheckInventory[] = [
    {
      id: '12341234',
      isRepeating: true,
      numberOfPadding: 5,
      product: 'Product 1',
      tag: 'Default',
      warningSeries: 500,
      startingSeries: 1,
      seriesPattern: 'ABCC',
      productId: '1',
      tagId: '1',
    },
  ];
  ngOnInit(): void {}
}
