import type { BaseEntity } from "typeorm";
import { type Adapter } from ".";
import { AnyObject } from "@/utils";

export class TypeormAdapter implements Adapter<BaseEntity> {
  constructor(private readonly entity: typeof BaseEntity) {}

  async create(entityData: AnyObject) {
    const entity = this.entity.create(entityData);
    await entity.save();
    return entity;
  }
}
