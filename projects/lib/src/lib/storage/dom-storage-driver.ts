import { StorageDriver, StorageResult } from '../types';

export class DOMStorageDriver implements StorageDriver {
  constructor(private readonly storage: Storage) {
  }

  get<T>(key: string): StorageResult<T | null> | T | null {
    try {
      const value = this.storage.getItem(key);

      if (typeof value === 'string') {
        return JSON.parse(value);
      }

    } catch (e) {
    }

    return null;
  }

  set<T, R>(key: string, value: T): void | StorageResult<R> {
    this.storage.setItem(key, JSON.stringify(value));
    return;
  }

  remove<R>(key: string): void | StorageResult<R> {
    this.storage.removeItem(key);
    return;
  }
}

export const sessionStorageDriver = new DOMStorageDriver(sessionStorage);

export const localStorageDriver = new DOMStorageDriver(localStorage);
