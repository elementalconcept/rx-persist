import { DOMStorageDriver, localStorageDriver, sessionStorageDriver } from './dom-storage-driver';
import { StorageAccessMock } from '../internal/mocks/storage-access.mock';

describe('DOMStorageDriver', () => {
  let storageMock: StorageAccessMock;
  let driver: DOMStorageDriver;

  beforeEach(() => {
    storageMock = new StorageAccessMock();
    driver = new DOMStorageDriver(storageMock);
  });

  describe('methods', () => {
    it('should store value in the storage', () => {
      driver.set('getTest', 'value');
      expect(storageMock.getItem('getTest')).toBe(JSON.stringify('value'));
    });

    it('should retrieve value from storage', () => {
      storageMock.setItem('setTest', JSON.stringify('new value'));
      expect(driver.get('setTest')).toBe('new value');
    });

    it('should remove value from storage', () => {
      storageMock.setItem('removeTest', JSON.stringify('removed value'));
      driver.remove('removeTest');
      expect(storageMock.getItem('removeTest')).toBeNull();
    });

    it('should not fail when data is corrupted', () => {
      storageMock.storage[ 'failTest' ] = 123;
      expect(driver.get('failTest')).toBeNull();
    });
  });

  describe('exports', () => {
    it('should export default drivers', () => {
      expect(sessionStorageDriver).toBeDefined();
      expect(localStorageDriver).toBeDefined();
    });
  });
});
