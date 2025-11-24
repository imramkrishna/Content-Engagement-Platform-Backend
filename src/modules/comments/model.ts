import db from "@/config/db";
import { commentAttributes } from "./attributes";

const Comment = db.define("comments", commentAttributes, {
  tableName: "comments",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Comment;
