import { Component, input, OnInit } from '@angular/core';
import { ProductType } from '../../../_models/product-type';

@Component({
  selector: 'app-configuration-list',
  standalone: true,
  imports: [],
  templateUrl: './configuration-list.component.html',
  styleUrl: './configuration-list.component.css'
})
export class ConfigurationListComponent implements OnInit{

  productType = input.required<ProductType>();
  configurationData:string = ""
  ngOnInit(): void {
    this.productType;
  }

  getConfigurationData(id: string){
    this.configurationData = id; 
  }

}
