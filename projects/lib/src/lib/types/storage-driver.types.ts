import { Observable } from 'rxjs';

export type StorageResult<R> = Promise<R> | Observable<R>;

export interface StorageDriverTypes {
  set<T, R>(key: string, value: T): void | StorageResult<R>;

  get<T>(key: string): T | null | StorageResult<T | null>;

  remove<R>(key: string): void | StorageResult<R>;
}
