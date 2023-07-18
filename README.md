# @vantezzen/seed

> Laravel-inspired seeding system for JavaScript

[![NPM](https://img.shields.io/npm/v/@vantezzen/seed.svg)](https://www.npmjs.com/package/@vantezzen/seed) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This package adds a seeding and factory pattern to entities in your project. If you are familiar with Seeding in Laravel or similar frameworks, you'll feel right at home!

The library is ORM-agnostic and intentionally minimal so you can quickly create seeding data in any project. It doesn't provide a CLI or commands to seed, but rather allows you to run the seeders anywhere in your code, e.g. to add them to API endpoints for your admin dashboard or in your own CLI tools.

## Install

```bash
npm install @vantezzen/seed
```

It is highly recommended - though not required - to also install faker.js for generating fake data in your Factories:

```bash
npm install @faker-js/faker
```

## Usage

### Adapter

Factories need an adapter to create entities in your database. This library provides these adapters:

- `new PlainAdapter()`: Simply returns the created entities without persisting them anywhere as plain objects
- `new TypeormAdapter(entity)`: Persists the created entities using TypeORM. The provided entity must be a TypeORM entity class.

Additionally, you can easily create your own adapter by implmenting the `Adapter` interface:

```ts
import { Adapter } from "@vantezzen/seed";

export default class MyAdapter implements Adapter {
  async create(entityData: any) {
    // Create your entity here
    const entity = new MyEntity(entityData);
    await entity.saveInDatabase();
    return entity;
  }
}
```

### Factory

A factory allows defining entity data and creates dummy instances of your entities.

Example of a factory for a "Purchase" entity using TypeORM:

```tsx
import { Factory, TypeormAdapter } from "@vantezzen/seed";

// Your entity that you want to seed
import Purchase from "../entities/Purchase";

// Faker.js is recommended but not required
import { faker } from "@faker-js/faker";

export default class PurchaseFactory
  // Your factory should extend this package's base factory
  extends Factory
{
  // Implement a "getAdapter" function that returns the adapter to use to store the created entities
  getEntity() {
    return new TypeormAdapter(Purchase);
  }

  // Your "definition" function should return the data that should be used to create the entity
  definition() {
    return {
      // Faker is used here to get random data for each new entity
      // but you can also use static data or any other method to generate data
      shopName: faker.company.name(),
      purchasedAt: faker.date.past(),
    };
  }
}
```

To create new entities using this factory, simply call the "create()" method provided by the base factory:

```ts
const factory = new PurchaseFactory();
const purchases = await factory.withCount(5).create();
```

The return value is an **array** of entities.

If you want to explicitly create a single entity, you can use "createOne()":

```ts
const factory = new PurchaseFactory();
const purchase = await factory.createOne();
```

#### Using options

Optionally, your factory can also type hint that options can be provided:

```tsx
import { Factory, PlainAdapter } from "@vantezzen/seed";
import { faker } from "@faker-js/faker";

export type PurchaseFactoryOptions = {
  purchaseDate?: Date;
};

// Provide the type of your options as the first generic
export default class PurchaseFactory extends Factory<PurchaseFactoryOptions> {
  getAdapter() {
    return new PlainAdapter();
  }

  // Please note that these options will be made optional - your factory should still work, even if "undefined" is supplied
  definition(options?: PurchaseFactoryOptions) {
    return {
      shopName: faker.company.name(),
      purchasedAt: options?.useRecentPurchaseDate
        ? new Date()
        : faker.date.past(),
    };
  }
}
```

The option values can be provided using a parameter to ".create()":

```ts
const factory = new PurchaseFactory();
const purchases = await factory.create({
  useRecentPurchaseDate: true,
});
```

#### Override values

When using a factory, you might want to force override specific values. These can simply call "withOverrideData":

```ts
const factory = new PurchaseFactory();
const purchases = await factory
  .withOverrideData({
    shopName: "Foo Bar",
  })
  .create();
// shop name will be "Foo Bar" for all entitites
```

#### Creating multiple entities at once

".create()" will return an array of entities as the factory is designed to create multiple entities at once if needed.

To set the count of entities to create, you can:

- Pass the number to the constructor (like in Laravel):

```ts
const factory = new PurchaseFactory(10);
const purchases = await factory.create();
// "purchases" contains 10 entities
```

- Set the count with "withCount":

```ts
const factory = new PurchaseFactory();
const purchases = await factory.withCount(10).create();
// "purchases" contains 10 entities
```

### Seeder

Seeders allow calling and combining Factories. To create a seeder, simply extend the base seeder and implement a "run" method.

```ts
import { Seeder } from "@vantezzen/seed";

// Factories that you want to use in your seeder
import PurchaseFactory from "../factories/PurchaseFactory";
import PurchaseItemFactory from "../factories/PurchaseItemFactory";

export default class PurchaseSeeder extends Seeder {
  async run() {
    // Create 10 purchases
    const purchaseFactory = new PurchaseFactory(10);
    const purchases = await purchaseFactory.create();

    // Create 10 purchaseItems for each created purchase
    const purchaseItemFactory = new PurchaseItemFactory(10);
    purchases.forEach((purchase) => {
      purchaseItemFactory.create({ purchase });
    });
  }
}
```

You can simply call this "run" method to execute the seeder:

```ts
const seeder = new PurchaseSeeder();
await seeder.run();
```

#### Running multiple seeders

Seeders can call multiple other seeders using the `call` and `callParallel` methods:

```ts
import { Seeder } from "@vantezzen/seed";
import PurchaseSeeder from "./PurchaseSeeder";
import UserSeeder from "./PurchaseItemSeeder";

export default class DatabaseSeeder extends Seeder {
  async run() {
    // Calls the seeders in sequence
    await this.call([PurchaseSeeder, UserSeeder]);

    // Call the seeders in parallel
    // This is useful if you have seeders that don't depend on each other
    // and can be run in parallel to speed up the seeding process
    await this.callParallel([PurchaseSeeder, UserSeeder]);
  }
}
```

## Development

1. Clone this repository
2. Run `npm install` in the root directory and `/example` (`npm i && cd example && npm i`)
3. Run `npm start` in `/example` to start development using the example project
4. You can use `npm test` to run the Jest tests

## License

MIT © [vantezzen](https://github.com/vantezzen)
