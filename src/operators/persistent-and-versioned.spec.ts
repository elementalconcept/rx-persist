import { BehaviorSubject, Subject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { persistentAndVersioned } from './persistent-and-versioned';
import { DOMStorageDriver } from '../storage';
import { StorageMock } from '../internal/mocks/storage-mock';
import { VersionedOptions } from '../models';

describe('persistentAndVersioned', () => {
  const key = 'key';
  const versionKey = 'versionKey';

  let storageMock: Storage;
  let driver: DOMStorageDriver;
  let options: VersionedOptions;
  let scheduler: TestScheduler;

  beforeEach(() => {
    storageMock = new StorageMock();
    driver = new DOMStorageDriver(storageMock);

    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    options = {
      currentVersion: 0,
      versionKey,
      storage: driver,
      migrate: (version: number, value: any) => value
    };
  });

  it('should replace next method on Subject', () => {
    const subject = new Subject();
    const next = subject.next;
    const persistentSubject = persistentAndVersioned(subject, key, options);

    expect(persistentSubject.next).not.toBe(next);
  });

  it('should emit default value when storage is empty', () => {
    scheduler.run(({ expectObservable }) => {
      expectObservable(persistentAndVersioned<string, Subject<string>>(new BehaviorSubject('default text'), key, options))
        .toBe('a', { a: 'default text' });
    });
  });

  it('should emit saved value', () => {
    driver.set(key, 'someText');

    scheduler.run(({ expectObservable }) => {
      expectObservable(persistentAndVersioned<string, Subject<string>>(new BehaviorSubject('default text'), key, options))
        .toBe('a', { a: 'someText' });
    });
  });

  it('should run data migrations', () => {
    driver.set(key, { label: 'Hello!' });

    options.currentVersion = 3;
    options.migrate = (version: number, value: any) => {
      switch (version) {
        case 0:
          value.id = 1;
          break;

        case 1:
          value.code = 'hello-message';
          break;

        case 2:
          delete value.id;
          break;
      }

      return value;
    };

    scheduler.run(({ expectObservable }) => {
      expectObservable(persistentAndVersioned<string, Subject<string>>(new BehaviorSubject('default text'), key, options))
        .toBe('a', { a: { label: 'Hello!', code: 'hello-message' } });
      expect(driver.get(options.versionKey as string)).toBe(3);
    });
  });
});
