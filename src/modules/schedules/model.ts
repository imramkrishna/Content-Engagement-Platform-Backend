import db from "../../config/db";
import { scheduleAttributes } from "./attributes";
const Schedule = db.define("schedules", scheduleAttributes, {
  tableName: "schedules",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Schedule;
