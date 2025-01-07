import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  canceRegister = output<boolean>();
  model: any = {}

  register() {
    this.accountService.register(this.model).subscribe({
      next: response => {
        this.cancel();
        this.router.navigateByUrl('/banks');
      }
    })
  }

  cancel() {
    this.canceRegister.emit(false);
  }
}
