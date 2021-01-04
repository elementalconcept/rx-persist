export class StorageMock implements Storage {
  readonly storage: any = {};

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
