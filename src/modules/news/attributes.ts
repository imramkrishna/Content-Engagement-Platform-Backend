import { DataTypes } from "sequelize";

const tableName = "news";

const newsAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.JSON,
  },
  slug: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.JSON,
  },
  image: {
    type: DataTypes.STRING,
  },
  images: {
    type: DataTypes.JSON,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: "categories",
      key: "id",
      index: true,
    },
    onDelete: "CASCADE",
  },
  status: {
    type: DataTypes.ENUM("Published", "Schedule", "Draft"),
  },
  infos: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isTrending: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  isLikedByMe: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const newsCategoriesAttributes = {
  newsId: {
    type: DataTypes.INTEGER,
    references: {
      model: "news",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: "categories",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

export { newsAttributes, newsCategoriesAttributes, tableName };
