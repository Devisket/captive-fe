import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'check-inventory-detail',
  standalone:true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './check-inventory-detail.component.html',
  styleUrl: './check-inventory-detail.component.scss',
})
export class CheckInventoryDetailComponent implements OnInit{
    ngOnInit(): void 
    {   
    }
}
