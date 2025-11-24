import { Op, literal, QueryTypes } from "sequelize";
import sequelize from "../../config/db";
import UserCategories from "../userCategories/model";
import Category from "../categories/model";
import News from "./model";
const buildListFilter = async (
  params: any,
  preferredCategoryIds: number[] = []
) => {
  const offset = (params.page - 1) * params.limit;
  const limit = params.limit;
  let categoryIds: number[] = [];

  if (!params?.isAdmin) {
    if (params?.type === "all") {
      // Show all categories
      const allCategories = await Category.findAll();
      categoryIds = allCategories.map((c: any) => c.id);
    } else if (params?.type === "preferred") {
      if (params?.sessionId) {
        // const userCategories = await UserCategories.findOne({
        //   where: { sessionId: params.sessionId },
        // });
        // categoryIds = userCategories?.categoryIds || [];
      } else if (preferredCategoryIds.length > 0) {
        categoryIds = preferredCategoryIds;
      } else {
        // fallback to all categories if preferred not set
        const allCategories = await Category.findAll();
        categoryIds = allCategories.map((c: any) => c.id);
      }
    }

    // Explicit categoryId override
    if (params?.categoryId) {
      const parsedCategoryIds = parseCategoryIdInput(params.categoryId);
      if (parsedCategoryIds.length) categoryIds = parsedCategoryIds;
    }
  }

  const filter: any = {
    limit,
    offset,
    where: {},
    attributes: [
      "id",
      "isTrending",
      "title",
      "infos",
      "content",
      "isActive",
      "status",
      "slug",
      "image",
      "infos",
      "images",
      "createdAt",
      [
        literal(`(
          SELECT COUNT(*)
          FROM newsViews
          WHERE newsViews.newsId = news.id
        )`),
        "totalViews",
      ],
    ],
    order: [],
    include: [],
    group: ["news.id"],
  };
  if (params?.status) {
    filter.where.status = params.status;
  } else {
    filter.where.status = "Published";
  }
  // Apply search
  if (params?.search) {
    filter.where[Op.or] = [{ title: { [Op.iLike]: `%${params.search}%` } }];
  }

  // Apply active/inactive filter
  if (params?.isActive === "true" || params?.isActive === true) {
    filter.where.isActive = true;
  }
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  if (params?.orderByTrending === "true" || params?.orderByTrending === true) {
    // Fetch news from last 48 hours only
    filter.where.createdAt = { [Op.gte]: fortyEightHoursAgo };
    filter.order.push([
      literal(`(
        SELECT COUNT(*)
        FROM newsViews
        WHERE newsViews.newsId = news.id
      )`),
      "DESC",
    ]);
  }

  if (params?.isTrending === "true" || params?.isTrending === true) {
    // Fetch trending news
    if (
      params?.orderByTrending === "true" ||
      params?.orderByTrending === true
    ) {
      // If both true: trending OR last 48 hours
      filter.where = {
        ...filter.where,
        [Op.or]: [
          { isTrending: true },
          { createdAt: { [Op.gte]: fortyEightHoursAgo } },
        ],
      };
    } else {
      // Only trending
      filter.where.isTrending = true;
      filter.order = [["createdAt", "DESC"]];
    }
  }

  // Default order if nothing specified
  if (!filter.order.length) {
    filter.order = [["createdAt", "DESC"]];
  }

  //alternative code

  // Filter trending news only within last 48 hours
  // if (params?.orderByTrending === "true" || params?.orderByTrending === true) {
  //   const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  //   filter.where.createdAt = { [Op.gte]: fortyEightHoursAgo };
  //   filter.order.push([
  //     literal(`(
  //       SELECT COUNT(*)
  //       FROM newsViews
  //       WHERE newsViews.newsId = news.id
  //     )`),
  //     "DESC",
  //   ]);
  // } else {
  //   filter.order = [["createdAt", "DESC"]];
  // }

  // // Filter by trending flag if provided
  // if (params?.isTrending === "true" || params?.isTrending === true) {
  //   filter.where.isTrending = true;
  // }
  // if (params?.isTrending === "false" || params?.isTrending === false) {
  //   filter.where.isTrending = false;
  // }

  // Include categories
  const includeCategory: any = {
    model: Category,
    as: "categories",
    attributes: ["id", "name"],
    through: { attributes: [] },
  };
  if (categoryIds.length > 0) {
    includeCategory.where = { id: { [Op.in]: categoryIds } };
  }

  filter.include.push(includeCategory);

  return filter;
};

const parseCategoryIdInput = (input: any): number[] => {
  let ids: number[] = [];

  if (Array.isArray(input)) {
    ids = input.map((id) => Number(id)).filter((id) => !isNaN(id));
  } else if (typeof input === "string") {
    try {
      if (input.startsWith("[")) {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
          ids = parsed.map((id) => Number(id)).filter((id) => !isNaN(id));
        }
      } else {
        ids = input
          .split(",")
          .map((id: any) => Number(id.trim()))
          .filter((id: any) => !isNaN(id));
      }
    } catch {
      ids = [];
    }
  }

  return ids;
};

const buildFindFilter = async (params: any) => {
  const filter: any = {
    where: {},
    attributes: [
      "id",
      "isTrending",
      "title",
      "infos",
      "content",
      "isActive",
      "status",
      "slug",
      "image",
      "infos",
      "images",
      "createdAt",
      [
        literal(`
        (
          SELECT COUNT(*)
          FROM newsViews
          WHERE newsViews.newsId = news.id
        )
      `),
        "totalViews",
      ],
    ],
  };
  if (!!params?.id) {
    filter.where.id = params?.id;
  }
  if (params?.status) {
    filter.where.status = params?.status;
  }
  return filter;
};

export default {
  buildListFilter,
  buildFindFilter,
};

//commit
