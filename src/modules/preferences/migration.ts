import { QueryInterface } from "sequelize";
import { preferenceAttributes } from "./attributes";

const tableName = "preferences";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, preferenceAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};

export { up, down };
