import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class DummyEntity extends BaseEntity {
  isDummyEntity = true;

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
  })
  text!: string;
}
