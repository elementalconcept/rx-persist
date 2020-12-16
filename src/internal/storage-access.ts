import { from, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { StorageDriver } from '../models';

export function load<T>(key: string, next: (value: T) => void, storage: StorageDriver) {
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

export function save<T>(key: string, storage: StorageDriver, value: T): Observable<any> {
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
