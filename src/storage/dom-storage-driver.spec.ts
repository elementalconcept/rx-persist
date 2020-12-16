import { DOMStorageDriver, localStorageDriver, sessionStorageDriver } from './dom-storage-driver';
import { StorageMock } from '../internal/mocks/storage-mock';

describe('DOMStorageDriver', () => {
  let storageMock: Storage;
  let driver: DOMStorageDriver;

  beforeEach(() => {
    storageMock = new StorageMock();
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
  });

  describe('exports', () => {
    it('should export default drivers', () => {
      expect(sessionStorageDriver).toBeDefined();
      expect(localStorageDriver).toBeDefined();
    });
  });
});
