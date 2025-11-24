import { Op } from "sequelize";
import Category from "../categories/model";
import Preference from "./model";

export const preferenceServices = {
  list: async (
    user: any,
    language: "en" | "np" = "en",
    query: { type?: "preferred" | "nonPreferred" | "all" } = {}
  ) => {
    const userId = user.id;

    // Fetch preferred categories
    const preferredCategories = await Preference.findAll({
      where: { userId },
      include: {
        model: Category,
        as: "category",
        attributes: ["id", "name", "image"],
      },
    });

    const preferredCategoryIds = preferredCategories.map(
      (p: any) => p.categoryId
    );

    // Fetch non-preferred categories
    const nonPreferredCategories = await Category.findAll({
      where: {
        id: { [Op.notIn]: preferredCategoryIds },
      },
      attributes: ["id", "name", "image"],
    });

    // Map categories to include name in correct language and image
    const preferred = preferredCategories.map((p: any) => ({
      id: p.category.id,
      name: p.category.name[language] || p.category.name["en"],
      image: p.category.image,
      type: "preferred",
    }));

    const nonPreferred = nonPreferredCategories.map((c: any) => ({
      id: c.id,
      name: c.name[language] || c.name["en"],
      image: c.image,
      type: "nonPreferred",
    }));

    // Return based on query.type
    switch (query.type) {
      case "preferred":
        return preferred;
      case "nonPreferred":
        return nonPreferred;
      case "all":
      default:
        return [...preferred, ...nonPreferred];
    }
  },

  getPreferredCategoryIds: async (userId: number) => {
    const preferences = await Preference.findAll({
      where: { userId },
      attributes: ["categoryId"],
    });

    if (!preferences || preferences.length === 0) return [];

    return preferences.map((p: any) => p.categoryId);
  },
};
