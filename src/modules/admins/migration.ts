import { QueryInterface } from "sequelize";
import { adminAttributes, tableName } from "./attributes";
const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, adminAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};
export { up, down };
