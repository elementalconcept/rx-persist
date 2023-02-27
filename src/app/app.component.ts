import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';

import { persistent } from '@elemental-concept/rx-persist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
  counter = 0;

  private readonly counter$ = persistent(new BehaviorSubject(0), 'counter');
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.counter$.subscribe(counter => this.counter = counter);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  increase = () => this.counter$.next(this.counter + 1);

  decrease = () => this.counter$.next(this.counter - 1);
}
