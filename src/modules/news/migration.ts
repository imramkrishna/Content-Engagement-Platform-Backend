import { QueryInterface } from "sequelize";
import {
  newsAttributes,
  newsCategoriesAttributes,
  tableName,
} from "./attributes";
const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(tableName, newsAttributes);
  await queryInterface.createTable("news_categories", newsCategoriesAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable(tableName);
  await queryInterface.dropTable("news_categories");
};
export { up, down };
