import db from "@/config/db";
import { attributes, tableName } from "./attributes";
import News from "../news/model";

const NewsViews = db.define(tableName, attributes, {
  tableName,
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

const insertHook = async (data: any) => {
  console.log("here");
  const newsExists = await News.findByPk(data.newsId);
  if (!newsExists) {
    throw new Error("Invalid newsId: news does not exist");
  }

  const filter: any = {
    where: {
      newsId: data.newsId,
    },
  };

  if (data?.createdBy) {
    filter.where.createdBy = data.createdBy;
  } else if (data?.sessionId) {
    filter.where.sessionId = data.sessionId;
  }

  const exist = await NewsViews.findOne(filter);
  if (exist) {
    throw new Error("View already counted for this user/session and news");
  }
};

NewsViews.beforeCreate(insertHook);

export default NewsViews;
