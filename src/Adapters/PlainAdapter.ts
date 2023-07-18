import { type AnyObject } from "@/utils";
import { type Adapter } from "./Adapter";

/**
 * Plain adapter: Return the entity data as is
 */
export class PlainAdapter<InputType = AnyObject> implements Adapter {
  async create(entityData: InputType): Promise<InputType> {
    return entityData;
  }
}
