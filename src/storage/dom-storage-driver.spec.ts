import { localStorageDriver, sessionStorageDriver } from './dom-storage-driver';

describe('DOMStorageDriver', () => {
  describe('methods', () => {

  });

  describe('exports', () => {
    it('should export default drivers', () => {
      expect(sessionStorageDriver).toBeDefined();
      expect(localStorageDriver).toBeDefined();
    });
  });
});
