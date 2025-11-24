import db from "@/config/db";
import { pollAttributes } from "./attributes";

const Poll = db.define("polls", pollAttributes, {
  tableName: "polls",
  timestamps: true,
});

export default Poll;
