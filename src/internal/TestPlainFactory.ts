import { Factory, PlainAdapter } from "../main";
import { faker } from "@faker-js/faker";

export default class TestPlainFactory extends Factory {
  getAdapter() {
    return new PlainAdapter();
  }

  definition() {
    return {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }
}
