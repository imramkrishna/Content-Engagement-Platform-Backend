import { QueryInterface } from "sequelize";
import { attributes, tableName } from "./attributes";
const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, attributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};
export { up, down };
