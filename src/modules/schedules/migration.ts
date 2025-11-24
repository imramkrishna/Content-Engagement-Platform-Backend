import { QueryInterface } from "sequelize";
import { scheduleAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("schedules", scheduleAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("schedules");
};

export { up, down };
