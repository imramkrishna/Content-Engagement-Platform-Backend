import { QueryInterface } from "sequelize";
import { generalSettingAttributes } from "./attributes";
const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(
    "general_settings",
    generalSettingAttributes
  );
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("general_settings");
};
export { up, down };
