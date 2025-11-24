import db from "@/config/db";
import { attributes, tableName } from "./attributes";

const Bookmark: any = db.define(tableName, attributes, {
  tableName,
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Bookmark;
