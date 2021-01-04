# rx-persist

`rx-persist` provides a persistence operator for RxJS subjects. It automatically saves each event emission into selected
storage and restores last emission from storage on Subject creation.

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

Check [ng-sample-app](https://github.com/elementalconcept/rx-persist/tree/master/ng-sample-app) for a simple usage
example in an Angular application.

## API

### persistent()

```typescript
function persistent<T, S extends Subject<T>>(subject: S, key: string | string[], storage: StorageDriver = localStorageDriver): S;
```

* `subject` - specifies a subject to add persistence to.
* `key` - key to use to read and write data changes into the storage.
* `storage` - optionally specify a storage to use. `window.localStorage` is used by default.

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
