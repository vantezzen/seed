import { expect, test } from "vitest";
import TestPlainFactory from "../internal/TestPlainFactory";

test("creates an entity", async () => {
  const factory = new TestPlainFactory();
  const entity = await factory.createOne();
  expect(Object.keys(entity)).toEqual(["name", "email", "password"]);
});

test("creates multiple entities with different data", async () => {
  const factory = new TestPlainFactory(2);
  const entities = await factory.create();
  expect(entities.length).toEqual(2);
  expect(entities[0]).not.toEqual(entities[1]);
});

test("caches the adapter", async () => {
  let adapterCalls = 0;
  class TestAdapter {
    constructor() {
      adapterCalls++;
    }

    async create() {
      return Promise.resolve({});
    }
  }

  const factory = new (class extends TestPlainFactory {
    getAdapter() {
      return new TestAdapter();
    }
  })();

  await factory.createOne();
  await factory.createOne();

  expect(adapterCalls).toEqual(1);
});

test("will use the override data", async () => {
  const factory = new TestPlainFactory();
  factory.withOverrideData({ name: "John" });
  const entity = await factory.createOne();
  expect(entity.name).toEqual("John");
});

test("will use count", async () => {
  const factory = new TestPlainFactory(2);
  const entities = await factory.create();
  expect(entities.length).toEqual(2);
});

test("will use updated count", async () => {
  const factory = new TestPlainFactory(2);
  factory.withCount(3);
  const entities = await factory.create();
  expect(entities.length).toEqual(3);
});
