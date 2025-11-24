import db from "@/config/db";
import { feedbackAttributes } from "./attributes";

const Feedback = db.define("feedbacks", feedbackAttributes, {
  tableName: "feedbacks",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Feedback;
