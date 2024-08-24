import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { UsersService } from '../../../_services/users.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TitleCasePipe, DatePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  userService = inject(UsersService);

  ngOnInit(): void {
    if (this.userService.users().length === 0) this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers();
  }
}
