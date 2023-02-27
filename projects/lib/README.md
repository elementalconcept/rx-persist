# rx-persist

`@elemental-concept/rx-persist` provides a persistence operator for RxJS subjects. It automatically saves each event
emission into selected storage and restores last emission from storage on Subject creation. Additionally, provides
storage versioning with `persistentAndVersioned` operator.

## Use-case example

Imagine you're working on a front-end application for an online clothing shop, and you want your users to be able to
filter products by size and colour. You might define the following interface to describe such filter:

```typescript
export interface ProductFilter {
  size: string;
  color: string;
}

export const defaultProductFilter: ProductFilter = {
  size: 'any',
  color: 'any'
};
```

And then you'd have a subject which will allow different parts of your application to emit new filter values based on
user input and to subscribe to such events. You can also chain this filter subject into API call to fetch new data each
time your users request changes:

```typescript
export class ProductsService {
  private apiService = new ApiService();

  private productFilter$ = new BehaviorSubject<ProductFilter>(defaultProductFilter);

  private products$ = this.productFilter$
    .pipe(switchMap(filter => this.apiService.getProducts(filter)));

  get productFilter(): Observable<ProductFilter> {
    return this.productFilter$.asObservable();
  }

  get products(): Observable<Product[]> {
    return this.products$;
  }

  setFilter(filter: ProductFilter) {
    this.productFilter$.next(filter);
  }
}
```

But what would happen if a user decides to refresh your page in the browser? Filters will be reset to their default
state, and most likely this is not something you want to happen. This is where `rx-persist` comes into play. Simply wrap
your subject with `persistent` operator and each filter change will be stored in `window.localStorage`:

```typescript
export class ProductsService {
  // ...

  private productFilter$ = persistent(
    new BehaviorSubject<ProductFilter>(defaultProductFilter),
    'storageKey');

  // ...
}
```

## Installation

Using npm:

```shell
$ npm i @elemental-concept/rx-persist
```

Using Yarn:

```shell
$ yarn add @elemental-concept/rx-persist
```

## Example

Check [this example](https://github.com/elementalconcept/rx-persist/src/app) for a simple usage
example in an Angular application.

## API

### persistent()

```typescript
function persistent<T, S extends Subject<T>>(subject: S, key: string | string[], storage: StorageDriver = localStorageDriver): S;
```

* `subject` - specifies a subject to add persistence to.
* `key` - key to use to read and write data changes into the storage.
* `storage` - optionally specify a storage to use. `window.localStorage` is used by default.

### persistentAndVersioned()

```typescript
function persistentAndVersioned<T, S extends Subject<T>>(subject: S, key: string | string[], options: VersionedOptions): S;
```

* `subject` - specifies a subject to add persistence to.
* `key` - key to use to read and write data changes into the storage.
* `options` - set of options for versioning.

### VersionedOptions

```typescript
interface VersionedOptions {
  currentVersion: number;
  versionKey: string | string[];
  migrate: (version: number, value: any) => any;

  storage?: StorageDriver;
}
```

* `currentVersion` - specifies current version application expects.
* `versionKey` - storage key to fetch version information.
* `migrate` - method to run migrations between versions.
* `storage` - same as in `persistent()`.

### StorageDriver

```typescript
type StorageResult<R> = Promise<R> | Observable<R>;

interface StorageDriver {
  set<T, R>(key: string, value: T): void | StorageResult<R>;

  get<T>(key: string): T | null | StorageResult<T | null>;

  remove<R>(key: string): void | StorageResult<R>;
}
```

Describes a contract to implement custom storage support.

### DOMStorageDriver

```typescript
export class DOMStorageDriver implements StorageDriver {
  constructor(private readonly storage: Storage) {
  }
}
```

`StorageDriver` for custom DOM `Storage` implementations.

### sessionStorageDriver

```typescript
const sessionStorageDriver = new DOMStorageDriver(sessionStorage);
```

Pre-defined `StorageDriver` which uses `window.sessionStorage` as a back-end.

### localStorageDriver

```typescript
const sessionStorageDriver = new DOMStorageDriver(localStorage);
```

Pre-defined `StorageDriver` which uses `window.localStorage` as a back-end.

## Versioning

Data structure saved in a persistent Subject might change over life span of your application. To avoid data corruption
`persistentAndVersioned()` operator is introduced to be used instead of `persistent()`. Versioning starts with 0 and
gets incremented by 1 on each data structure change.

When `persistentAndVersioned()` is called it will load currently saved version from storage from `versionKey` and will
compare this value to `currentVersion`. It will then call `migrate()` multiple times passing current version and
incrementing it on success. For example, `currentVersion` is set to `7`, but version number obtained from `versionKey`
is `5`. In this case `migrate()` will be called twice: for version `5` and version `6`.

`migrate()` should check current version, apply data transformations and return the result. Result will be immediately
saved into storage and current version number will be bumped by 1.

### Example

Let's assume the following scenario:

1. When the app was created, subject contained an object with just one field - `name`.
2. After some time new field was added - `id`.
3. Finally, data structure was updated to also include user type in a field called `type`.
4. Most recent version is thus number `2` and there should be two migrations: from 0 to 1 and from 1 to 2.

```typescript
persistentAndVersioned<string, Subject<string>>(
  new BehaviorSubject({ id: 1, type: 'GUEST', name: 'Guest' }),
  'user',
  {
    currentVersion: 2,
    versionKey: 'userVersion',
    migrate: (version: number, value: any) => {
      switch (version) {
        case 0:
          value.id = 1;
          break;

        case 1:
          value.type = 'GUEST';
          break;
      }

      return value;
    }
  })
  .subscribe();
```
