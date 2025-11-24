import db from "@/config/db";
import { adminAttributes, tableName } from "./attributes";
const Admin = db.define(tableName, adminAttributes, {
  tableName: tableName,
  timestamps: true,
});

export default Admin;
