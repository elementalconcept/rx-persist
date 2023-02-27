import { from, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { StorageDriverTypes } from '../types';

export function load<T>(key: string, next: (value: T) => void, storage: StorageDriverTypes) {
  const result = storage.get(key);

  if (result instanceof Observable) {
    result.pipe(take(1)).subscribe(v => next(v));
    return;
  }

  if (typeof (result as Promise<T>)?.then === 'function') {
    (result as Promise<T>).then(v => next(v));
    return;
  }

  if (result !== null && result !== undefined) {
    next(result as T);
  }
}

export function loadAsObservable<T>(key: string, storage: StorageDriverTypes): Observable<T | null> {
  const result = storage.get<T>(key);

  if (result instanceof Observable) {
    return result.pipe(take(1));
  }

  if (typeof (result as Promise<T>)?.then === 'function') {
    return from(result as Promise<T>);
  }

  return of(result as T);
}

export function save<T>(key: string, storage: StorageDriverTypes, value: T): Observable<any> {
  const result = storage.set(key, value);

  if (result instanceof Observable) {
    return result.pipe(take(1));
  }

  if (typeof (result as Promise<T>)?.then === 'function') {
    return from(result as Promise<T>);
  }

  return of(true);
}

export function getStorageKey(key: string | string[]) {
  return typeof key === 'string' ? key : key.join('.');
}
