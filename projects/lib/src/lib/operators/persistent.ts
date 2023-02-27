import { Subject } from 'rxjs';

import { StorageDriver } from '../types';

import { localStorageDriver } from '../storage';

import { getStorageKey, load, save } from '../internal';

export function persistent<T, S extends Subject<T>>(subject: S,
                                                    key: string | string[],
                                                    storage: StorageDriver = localStorageDriver): S {

  const next = subject.next.bind(subject);

  const storageKey = getStorageKey(key);

  load(storageKey, next, storage);

  subject.next = (value: T) => save(storageKey, storage, value).subscribe(() => next(value));

  return subject;
}
