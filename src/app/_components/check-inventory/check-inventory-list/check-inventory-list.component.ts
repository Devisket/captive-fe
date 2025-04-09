import { Component, OnInit } from '@angular/core';
import { CheckInventory } from '../../../_models/check-inventory';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'check-inventory-list',
  standalone: true,
  imports: [
    TableModule
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
  ];
  ngOnInit(): void {}
}
