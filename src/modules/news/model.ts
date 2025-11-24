import db from "@/config/db";
import {
  newsAttributes,
  newsCategoriesAttributes,
  tableName,
} from "./attributes";

const News = db.define(tableName, newsAttributes, {
  tableName,
  timestamps: true,
});
const NewsCategories = db.define("news_categories", newsCategoriesAttributes, {
  tableName: "news_categories",
  timestamps: true,
});

const insertHook: any = async (news: any) => {
  const slug = `${news?.title?.en?.toLowerCase().replaceAll(" ", "_")}`;
  await news.update({ slug });
};

News.afterCreate(insertHook);
export default News;
