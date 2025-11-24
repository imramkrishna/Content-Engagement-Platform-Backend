import db from "../../config/db";
import { attributes, tableName } from "./attributes";

const UserCategories: any = db.define(tableName, attributes, {
  tableName,
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

const insertHook: any = async (data: any) => {
  const where: any = {};

  if (data?.createdBy) {
    where.createdBy = data.createdBy;
  }

  if (data?.sessionId) {
    where.sessionId = data.sessionId;
  }

  const exists = await UserCategories.findOne({ where });

  if (exists) {
    throw new Error("User already has category preferences saved");
  }
};

UserCategories.beforeCreate(insertHook);

export default UserCategories;
