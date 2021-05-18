import { Subject } from 'rxjs';

import { StorageDriver } from '../models';
import { localStorageDriver } from '../storage';
import { getStorageKey, load, save } from '../internal/storage-access';

export function persistent<T, S extends Subject<T>>(subject: S,
                                                    key: string | string[],
                                                    storage: StorageDriver = localStorageDriver): S {

  const next = subject.next.bind(subject);
  const storageKey = getStorageKey(key);

  load(storageKey, next, storage);
  subject.next = (value: T) => save(storageKey, storage, value).subscribe(() => next(value));

  return subject;
}
