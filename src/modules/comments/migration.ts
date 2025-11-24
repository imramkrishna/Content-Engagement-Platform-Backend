import { QueryInterface } from "sequelize";
import { commentAttributes } from "./attributes";

const tableName = "comments";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, commentAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};

export { up, down };
