import db from "@/config/db";
import { streakAttributes } from "./attributes";

const Streak = db.define("streaks", streakAttributes, {
  tableName: "streaks",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Streak;
