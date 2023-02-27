import { StorageDriver } from './storage-driver.types';

export interface VersionedOptions {
  currentVersion: number;
  versionKey: string | string[];
  migrate: (version: number, value: any) => any;

  storage?: StorageDriver;
}
