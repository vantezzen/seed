/**
 * Seeder class that is used to seed the database.
 */
export abstract class Seeder {
  /**
   * Run the seeder.
   */
  abstract run(): Promise<void>;

  /**
   * Run another seeder
   */
  protected async runSeeder<T extends Seeder>(seeder: Constructable<T>) {
    await new seeder().run();
  }

  /**
   * Run multiple seeders in parallel.
   * Please note that order is not guaranteed, so if you have dependencies between seeders, use `call` instead.
   */
  protected async callParallel<T extends Seeder>(
    seeders: Array<Constructable<T>>,
  ) {
    await Promise.all(seeders.map(async (seeder) => new seeder().run()));
  }

  /**
   * Run multiple seeders in sequence.
   * If your seeders don't have dependencies between each other, consider
   * using `callParallel` instead to speed up the seeding process.
   */
  protected async call<T extends Seeder>(seeders: Array<Constructable<T>>) {
    for (const seeder of seeders) {
      await new seeder().run();
    }
  }
}

/**
 * Factory class that is used to create entities.
 */
type Constructable<T> = new (...args: any[]) => T;
