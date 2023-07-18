import debugging from "debug";
import { type AnyObject } from "../utils";
import { type Adapter } from "@/Adapters";

const debug = debugging("typeorm-seeding:factory");

/**
 * A factory for creating entities
 *
 * @template OptionsType The options object that is passed to the factory
 */
export abstract class Factory<
  OptionsType = any,
  EntityType = any,
  AdapterType extends Adapter = Adapter<EntityType>,
> {
  private overrideData: AnyObject = {};

  /**
   * Create a factory for the given entity
   *
   * @param count Number of entities to create for each run of the factory (default: 1)
   */
  constructor(private count = 1) {}

  /**
   * Get the adapter that this factory uses
   */
  abstract getAdapter(): AdapterType;

  /**
   * Get the data to seed the entity with
   *
   * @param options The options object that is passed to the factory
   */
  abstract definition(options?: OptionsType): AnyObject;

  private adapterCache: AdapterType | undefined;
  private getAdapterCached() {
    if (!this.adapterCache) {
      this.adapterCache = this.getAdapter();
    }

    return this.adapterCache;
  }

  public async createOne(options?: OptionsType): Promise<EntityType> {
    const adapter = this.getAdapterCached();
    const seedData = this.definition(options);
    const entityData = { ...seedData, ...this.overrideData };
    debug(`Entity data: ${JSON.stringify(entityData)}`);

    const entity = await adapter.create(entityData);
    debug("Created entity");

    return entity;
  }

  /**
   * Let the factory run.
   * This will create the given number of entities and return them.
   *
   * @param options Options to pass to the factory
   * @returns The created entities
   */
  async create(options?: OptionsType): Promise<EntityType[]> {
    debug(`Creating ${this.count} entities`);

    const entities = [];
    for (let i = 0; i < this.count; i++) {
      debug(`Creating entity ${i + 1} of ${this.count}`);
      entities.push(await this.createOne(options));
    }

    debug(`Created ${entities.length} entities`);
    return entities;
  }

  /**
   * Override data of the created entities
   *
   * @param data Data to override the factory data with
   * @returns The factory
   */
  withOverrideData(data: AnyObject = {}) {
    this.overrideData = data;
    return this;
  }

  /**
   * Set the number of entities to create
   *
   * @param count Number of entities to create
   * @returns The factory
   */
  withCount(count: number) {
    this.count = count;
    return this;
  }
}
