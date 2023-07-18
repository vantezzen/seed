import { DataSource } from "typeorm";
import DummyEntity from "./DummyEntity";

export const initializeDataSource = async (): Promise<DataSource> => {
  const dataSource = createTestDataSource();
  await dataSource.initialize();
  return dataSource;
};

function createTestDataSource() {
  return new DataSource({
    type: "sqljs",
    entities: [DummyEntity],
    synchronize: true,
  });
}
