import { Factory, TypeormAdapter } from "../main";
import DummyEntity from "./typeorm/DummyEntity";

export default class TypeormFactory extends Factory {
  getAdapter() {
    return new TypeormAdapter(DummyEntity);
  }

  definition() {
    return {
      text: "Dummy",
    };
  }
}
