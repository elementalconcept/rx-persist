import { Component, OnDestroy, OnInit } from '@angular/core';

import { persistent } from '@elemental-concept/rx-persist';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
  counter: number;

  private readonly counter$ = persistent(new BehaviorSubject(0), 'counter');
  private sub: Subscription;

  ngOnInit(): void {
    this.sub = this.counter$.subscribe(c => this.counter = c);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  increase = () => this.counter$.next(this.counter + 1);

  decrease = () => this.counter$.next(this.counter - 1);
}
