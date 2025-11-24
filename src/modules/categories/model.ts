import db from "@/config/db";
import { categoryAttributes, tableName } from "./attributes";

const Category = db.define(tableName, categoryAttributes, {
  tableName,
  timestamps: true,
});
const insertHook: any = async (category: any) => {
  const slug = `${category?.name?.en?.toLowerCase().replaceAll(" ", "_")}`;
  await category.update({ slug });
};
Category.afterCreate(insertHook);

export default Category;
