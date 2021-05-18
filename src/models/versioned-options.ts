import { StorageDriver } from './storage-driver';

export interface VersionedOptions {
  versionKey: string | string[];
  migrate: (version: number, value: any) => any;

  storage?: StorageDriver;
}
