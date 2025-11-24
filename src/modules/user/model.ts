import db from "@/config/db";
import { userAttributes } from "./attributes";
const User = db.define("users", userAttributes, {
  tableName: "users",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default User;
