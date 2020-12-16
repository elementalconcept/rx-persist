import { Subject } from 'rxjs';

import { StorageDriver } from './models';
import { localStorageDriver } from './storage';
import { getStorageKey, load, save } from './internal/storage-access';

export function persistent<T, S extends Subject<T>>(subject: S,
                                                    key: string | string[],
                                                    storage: StorageDriver = localStorageDriver): S {

  const next = subject.next;
  const storageKey = getStorageKey(key);

  load(storageKey, next.bind(subject), storage);
  subject.next = (value: T) => save(storageKey, storage, value).subscribe(() => subject.next(value));

  return subject;
}
