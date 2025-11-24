import Category from "../modules/categories/model";
import News from "@/modules/news/model";
import Bookmark from "@/modules/bookmarks/model";
import UserCategories from "@/modules/userCategories/model";
import NewsViews from "@/modules/newsViews/model";
import { Op } from "sequelize";
import User from "@/modules/user/model";
import Streak from "@/modules/streaks/model";
import { streakAttributes } from "@/modules/streaks/attributes";

import Like from "@/modules/likes/model";
import Poll from "@/modules/polls/model";
import Feedback from "@/modules/feedback/model";
import Preference from "@/modules/preferences/model";

const setupAssociations = () => {
  Category.hasMany(News, {
    foreignKey: "categoryId",
    as: "news",
    onDelete: "SET NULL",
  });

  News.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
  });
  News.addScope("withCategory", (params: any) => {
    const scope: any = {
      model: Category,
      as: "category",
      attributes: ["id", "name"],
    };
    if (params?.categoryIds?.length) {
      scope.where = {
        id: {
          [Op.in]: params?.categoryIds,
        },
      };
    }
    return {
      include: [scope],
    };
  });
  News.hasMany(Bookmark, {
    foreignKey: "newsId",
    as: "bookmarks",
  });

  Bookmark.belongsTo(News, {
    foreignKey: "newsId",
    as: "news",
  });
  Bookmark.addScope("withNews", () => {
    const scope: any = {
      model: News,
      as: "news",
      attributes: [
        "id",
        "title",
        "content",
        "slug",
        "image",
        "categoryId",
        "status",
        "infos",
        "isActive",
        "createdAt",
      ],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
        },
        {
          model: Poll,
          as: "polls",
          attributes: ["id", "title", "question", "answers"],
        },
        {
          model: Like,
          as: "likes",
          attributes: ["id", "newsId", "senderId", "createdAt"],
        },
      ],
      required: false,
    };
    return {
      include: [scope],
    };
  });
  UserCategories.addScope("withCategories", () => {
    const scope: any = {
      model: Category,
      as: "categories",
      attributes: ["id", "name", "slug", "image", "isActive", "createdAt"],
    };
    return {
      include: [scope],
    };
  });

  NewsViews.belongsTo(News, {
    foreignKey: "newsId",
    as: "news",
    onDelete: "CASCADE",
  });

  News.hasMany(NewsViews, {
    foreignKey: "newsId",
    as: "views",
  });
  News.addScope("withNewsViews", () => {
    const scope: any = {
      model: NewsViews,
      as: "views",
      attributes: ["viewsCount"],
    };
    return {
      include: [scope],
    };
  });

  User.hasOne(Streak, {
    foreignKey: "userId",
    as: "streak",
    onDelete: "CASCADE",
  });

  Streak.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
  });

  User.addScope("withStreak", () => {
    const scope: any = {
      model: Streak,
      as: "streak",
      attributes: [
        "id",
        "day",
        "streakCount",
        "todayScrolls",
        "lastUpdatedDate",
        "streakAwardedToday",
        "createdAt",
        "updatedAt",
      ],
      required: false,
    };
    return {
      include: [scope],
    };
  });

  Streak.addScope("withUser", () => {
    const scope: any = {
      model: User,
      as: "user",
      attributes: ["id", "firstName", "lastName", "email"],
      required: false,
    };
    return {
      include: [scope],
    };
  });

  News.hasMany(Like, {
    foreignKey: "newsId",
    as: "likes",
    onDelete: "CASCADE",
  });

  Like.belongsTo(News, {
    foreignKey: "newsId",
    as: "news",
    onDelete: "CASCADE",
  });

  News.addScope("withLike", () => {
    const scope: any = {
      model: Like,
      as: "likes",
    };
    return {
      include: [scope],
    };
  });
  Like.addScope("withNews", () => {
    const scope: any = {
      model: News,
      as: "news",
    };
    return {
      include: [scope],
    };
  });

  // Feedback ↔ User
  User.hasMany(Feedback, {
    foreignKey: "userId",
    as: "feedbacks",
    onDelete: "CASCADE",
  });

  Feedback.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
  });

  Feedback.addScope("withUser", () => {
    const scope: any = {
      model: User,
      as: "user",
      attributes: ["id", "firstName", "lastName", "email", "phoneNo"],
      required: false,
      include: [
        {
          model: Streak,
          as: "streak",
        },
      ],
    };
    return {
      include: [scope],
    };
  });

  News.belongsToMany(Category, {
    through: "news_categories",
    foreignKey: "newsId",
  });

  Category.belongsToMany(News, {
    through: "news_categories",
    foreignKey: "categoryId",
  });

  News.addScope("withCategories", () => ({
    include: [
      {
        model: Category,
        as: "categories",
        attributes: ["id", "name"],
      },
    ],
  }));

  News.hasOne(Poll, { foreignKey: "newsId", as: "polls" });
  Poll.belongsTo(News, { foreignKey: "newsId", as: "news" });

  News.addScope("withPoll", () => {
    const scope: any = {
      model: Poll,
      as: "polls",
    };
    return {
      include: [scope],
    };
  });

  User.belongsToMany(Category, {
    through: "preferences",
    foreignKey: "userId",
  });
  Category.belongsToMany(User, {
    through: "preferences",
    foreignKey: "categoryId",
  });

  User.hasMany(Preference, { foreignKey: "userId", as: "preferences" });
  Preference.belongsTo(User, { foreignKey: "userId" });

  Preference.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
  Category.hasMany(Preference, { foreignKey: "categoryId" });
};

export default setupAssociations;
