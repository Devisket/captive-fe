import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MegaMenuModule } from 'primeng/megamenu';
import { MegaMenuItem, PrimeTemplate } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from '../../../core/_services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    MegaMenuModule,
    PrimeTemplate,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ApplicationHeaderComponent implements OnInit{
  themeService = inject(ThemeService);

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

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
