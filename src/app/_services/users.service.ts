import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { of, tap } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  users = signal<User[]>([]);

  getUsers() {
    return this.http.get<User[]>(this.baseUrl + 'users').subscribe({
      next: users => this.users.set(users)
    });
  }

  getUser(userId: any) {
    const user = this.users().find(x => x.id == userId);
    if( user !== undefined) return of(user);
    return this.http.get<User>(this.baseUrl + 'users/' + userId);
  }

  updateUser(user: User, userId: any) {
    return this.http.put(this.baseUrl + 'users/' + userId, user).pipe(
      tap(() => {
        this.users.update(users => users.map(m => m.id == user.id ? user : m))
      })
    );
  }

  updateProfile(user: User) {
    return this.http.put(this.baseUrl + 'users/', user);
  }

  addUser(user: User) {
    return this.http.post(this.baseUrl + 'users/add-user', user).pipe(
      tap(() => {
        this.users.update(users => users.map(m => m.id == user.id ? user : m))
      })
    );
  }
}
