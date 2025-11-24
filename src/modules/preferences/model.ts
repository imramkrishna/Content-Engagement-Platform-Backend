import db from "@/config/db";
import { preferenceAttributes } from "./attributes";

const Preference = db.define("preferences", preferenceAttributes, {
  tableName: "preferences",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Preference;
