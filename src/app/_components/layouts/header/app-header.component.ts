import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MegaMenuModule } from 'primeng/megamenu';
import { MegaMenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    BsDropdownModule,
    MegaMenuModule,
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ApplicationHeaderComponent implements OnInit{
  ngOnInit(): void {
    this.items = [
      {
        label: 'Bank List',
        icon: 'pi pi-building-columns',
        routerLink: '/banks'
      },
    ]
  }
  items:MegaMenuItem [] | undefined;
}
