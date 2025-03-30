import { Component, input, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [PanelModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
