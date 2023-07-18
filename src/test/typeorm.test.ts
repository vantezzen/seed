import TypeormFactory from "../internal/TypeormFactory";
import { initializeDataSource } from "../internal/typeorm/datasource";
import { type DataSource } from "typeorm";
import { beforeAll, expect, test } from "vitest";

let dataSource: DataSource;
beforeAll(async () => {
  dataSource = await initializeDataSource();
  return () => {
    dataSource.destroy();
  };
});

test("uses the provided entity", async () => {
  const factory = new TypeormFactory();
  const entities = await factory.create();
  expect(entities[0].isDummyEntity).toBe(true);
});

test("prioritizes override data", async () => {
  const factory = new TypeormFactory();
  const entities = await factory
    .withOverrideData({
      text: "foo",
    })
    .create();
  expect(entities[0].text).toBe("foo");
});

test("produces number of requested entities", async () => {
  const factory = new TypeormFactory(10);
  const entities = await factory.create();
  expect(entities).toHaveLength(10);
});

test("produces number of requested entities using withCount", async () => {
  const factory = new TypeormFactory(5);
  const entities = await factory.withCount(10).create();
  expect(entities).toHaveLength(10);
});

test("produces different entities", async () => {
  const factory = new TypeormFactory(2);
  const entities = await factory.create();
  expect(entities[0]).not.toBe(entities[1]);
});

test("uses factory data as default", async () => {
  const factory = new TypeormFactory();
  const entities = await factory.create();
  expect(entities[0].text).toBe("Dummy");
});
