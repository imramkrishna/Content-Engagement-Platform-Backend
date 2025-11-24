import { QueryInterface } from "sequelize";
import {
  notificationAttributes,
  pushNotificationAttributes,
} from "./attributes";
const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(
    "push_notifications",
    pushNotificationAttributes
  );
  await queryInterface.createTable("notifications", notificationAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("push_notifications");
  await queryInterface.dropTable("notifications");
};
export { up, down };
