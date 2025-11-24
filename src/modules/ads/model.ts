import db from "@/config/db";
import { adsAttributes } from "./attributes";

const Ads = db.define("ads", adsAttributes, {
  tableName: "ads",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Ads;
