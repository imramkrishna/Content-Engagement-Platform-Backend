import { QueryInterface } from "sequelize";
import { likeAttributes } from "./attributes";

const tableName = "likes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, likeAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};

export { up, down };
