import { from, Subject } from 'rxjs';
import { concatMap, filter, map, switchMap, takeLast } from 'rxjs/operators';

import { VersionedOptions } from '../models';
import { getStorageKey, load, loadAsObservable, save } from '../internal/storage-access';
import { localStorageDriver } from '../storage';

export function persistentAndVersioned<T, S extends Subject<T>>(subject: S,
                                                                key: string | string[],
                                                                options: VersionedOptions): S {
  const next = subject.next.bind(subject);
  const storage = options.storage !== undefined ? options.storage : localStorageDriver;
  const storageKey = getStorageKey(key);
  const versionKey = getStorageKey(options.versionKey);

  loadAsObservable<number>(versionKey, storage)
    .pipe(
      map(version => typeof version === 'number' ? version : 0),

      switchMap(version => from([ ...Array(options.currentVersion).keys() ])
        .pipe(filter(v => v >= version))),

      concatMap(version => loadAsObservable<any>(storageKey, storage)
        .pipe(
          map(value => options.migrate(version, value)),
          concatMap(value => save(storageKey, storage, value)),
          concatMap(() => save(versionKey, storage, version)))),

      takeLast(1))

    .subscribe({ complete: () => load(storageKey, next, storage) });

  subject.next = (value: T) => save(storageKey, storage, value).subscribe(() => next(value));

  return subject;
}
