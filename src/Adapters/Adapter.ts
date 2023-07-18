/**
 * Adapter: Connecting the factory to the ORM
 */
export type Adapter<EntityType = any, InputData = any> = {
  create(entityData: InputData): Promise<EntityType>;
};
