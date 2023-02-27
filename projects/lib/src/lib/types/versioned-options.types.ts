import { StorageDriverTypes } from './storage-driver.types';

export interface VersionedOptionsTypes {
  currentVersion: number;
  versionKey: string | string[];
  migrate: (version: number, value: any) => any;

  storage?: StorageDriverTypes;
}
