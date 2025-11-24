import { QueryInterface } from "sequelize";
import { userAttributes } from "./attributes";

const tableName = "users";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, userAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};

export { up, down };
