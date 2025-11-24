import { DataTypes } from "sequelize";

const tableName = "bookmarks";

const attributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  newsId: {
    type: DataTypes.INTEGER,
    onDelete: "CASCADE",
  },
  sessionId: {
    type: DataTypes.STRING,
  },

  createdBy: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { tableName, attributes };
