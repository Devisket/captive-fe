import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../../_services/account.service';
import { UsersService } from '../../../_services/users.service';
import { User } from '../../../_models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit{
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window.beforeunload', ['$event']) notify($event:any) {
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }
  user?: User;
  private accountService = inject(AccountService);
  private userService = inject(UsersService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    const account = this.accountService.currentUser();
    if(!account) return;
    this.userService.getUser(account.id)
    this.user = account
  }

  updateProfile() {
    this.userService.updateProfile(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.user);
      }
    })
  }

  onMemberChange(event: User) {
    this.user = event;
  }

}
