import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-subscription-cleanup',
  template: '',
})
export class SubscriptionCleanupComponent implements OnDestroy {
  protected destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
