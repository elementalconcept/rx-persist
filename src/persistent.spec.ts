import { BehaviorSubject, Subject } from 'rxjs';

import { StorageMock } from './internal/mocks/storage-mock';
import { DOMStorageDriver } from './storage';
import { persistent } from './persistent';

describe('persistent', () => {
  let storageMock: Storage;
  let driver: DOMStorageDriver;

  beforeEach(() => {
    storageMock = new StorageMock();
    driver = new DOMStorageDriver(storageMock);
  });

  it('should replace next method on Subject', () => {
    const subject = new Subject();
    const next = subject.next;
    const persistentSubject = persistent(subject, 'key');

    expect(persistentSubject.next).not.toBe(next);
  });

  it('should emit saved value', () => {
    const key = 'key';
    driver.set(key, 'someText');

    persistent<string, BehaviorSubject<string>>(new BehaviorSubject('default text'), key, driver)
      .subscribe(v => expect(v).toBe('someText'));
  });

  it('should emit default value when storage is empty', () => {
    const key = 'key';

    persistent<string, BehaviorSubject<string>>(new BehaviorSubject('default text'), key, driver)
      .subscribe(v => expect(v).toBe('default text'));
  });

  it('should persist emitted values', () => {
    const key = 'key';
    const initial = persistent<string, BehaviorSubject<string>>(new BehaviorSubject('default text'), key, driver);
    initial.next('new stuff');

    persistent<string, BehaviorSubject<string>>(new BehaviorSubject('default text'), key, driver)
      .subscribe(v => expect(v).toBe('new stuff'));
  });
});
