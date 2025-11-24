import { QueryInterface } from "sequelize";
import { adsAttributes } from "./attributes";

const tableName = "ads";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, adsAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};

export { up, down };
