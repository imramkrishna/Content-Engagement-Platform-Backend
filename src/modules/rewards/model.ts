import db from "@/config/db";
import { rewardAttributes, tableName } from "./attributes";

const Reward = db.define(tableName, rewardAttributes, {
  tableName,
  timestamps: true,
});

export default Reward;
