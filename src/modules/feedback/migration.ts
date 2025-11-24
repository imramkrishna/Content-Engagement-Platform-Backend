import { QueryInterface } from "sequelize";
import { feedbackAttributes } from "./attributes";

const tableName = "feedbacks";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, feedbackAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
};

export { up, down };
