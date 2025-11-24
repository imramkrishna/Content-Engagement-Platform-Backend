import { QueryInterface } from "sequelize";
import { pollAttributes } from "./attributes";
const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("polls", pollAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("polls");
};
export { up, down };
