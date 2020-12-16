import { DOMStorageDriver, localStorageDriver, sessionStorageDriver } from './dom-storage-driver';

class StorageMock implements Storage {
  private readonly storage: any = {};

  readonly length = 0;

  clear(): void {
  }

  getItem(key: string): string | null {
    return this.storage[ key ] === undefined ? null : this.storage[ key ];
  }

  key(index: number): string | null {
    return null;
  }

  removeItem(key: string): void {
    delete this.storage[ key ];
  }

  setItem(key: string, value: string): void {
    this.storage[ key ] = value;
  }
}

describe('DOMStorageDriver', () => {
  let mock: Storage;
  let driver: DOMStorageDriver;

  beforeEach(() => {
    mock = new StorageMock();
    driver = new DOMStorageDriver(mock);
  });

  describe('methods', () => {
    it('should store value in the storage', () => {
      driver.set('getTest', 'value');
      expect(mock.getItem('getTest')).toBe(JSON.stringify('value'));
    });

    it('should retrieve value from storage', () => {
      mock.setItem('setTest', JSON.stringify('new value'));
      expect(driver.get('setTest')).toBe('new value');
    });

    it('should remove value from storage', () => {
      mock.setItem('removeTest', JSON.stringify('removed value'));
      driver.remove('removeTest');
      expect(mock.getItem('removeTest')).toBeNull();
    });
  });

  describe('exports', () => {
    it('should export default drivers', () => {
      expect(sessionStorageDriver).toBeDefined();
      expect(localStorageDriver).toBeDefined();
    });
  });
});
