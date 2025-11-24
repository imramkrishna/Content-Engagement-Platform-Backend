import { QueryInterface } from "sequelize";
import { rewardAttributes, tableName } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, rewardAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};

export { up, down };
