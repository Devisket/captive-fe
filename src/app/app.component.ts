import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from './core/_services/account.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ApplicationHeaderComponent } from './shared/components/header/app-header.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ApplicationHeaderComponent,
    FooterComponent,
    LoadingComponent,
    ToastModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }
}
