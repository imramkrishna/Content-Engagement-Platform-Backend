import db from "@/config/db";
import { attributes, tableName } from "./attributes";

const UserDeviceToken = db.define(tableName, attributes, {
  tableName,
  timestamps: true,
});

export default UserDeviceToken;
