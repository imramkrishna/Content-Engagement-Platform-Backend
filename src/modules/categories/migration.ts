import { QueryInterface } from "sequelize";
import { categoryAttributes, tableName } from "./attributes";
const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, categoryAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};
export { up, down };
