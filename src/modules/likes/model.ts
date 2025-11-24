import db from "@/config/db";
import { likeAttributes } from "./attributes";

const Like = db.define("likes", likeAttributes, {
  tableName: "likes",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Like;
