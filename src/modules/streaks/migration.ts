import { QueryInterface } from "sequelize";
import { streakAttributes } from "./attributes";

const tableName = "streaks";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, streakAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};

export { up, down };
