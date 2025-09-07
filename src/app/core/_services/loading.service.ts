import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private activeRequests = 0;

  public loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.loadingSubject.next(false);
    }
  }

  forceHide(): void {
    this.activeRequests = 0;
    this.loadingSubject.next(false);
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }
}