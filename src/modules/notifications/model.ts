import db from "../../config/db";
import {
  notificationAttributes,
  pushNotificationAttributes,
} from "./attributes";

const PushNotification: any = db.define(
  "push_notifications",
  pushNotificationAttributes,
  {
    tableName: "push_notifications",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

const Notification: any = db.define("notifications", notificationAttributes, {
  tableName: "notifications",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export { PushNotification, Notification };
