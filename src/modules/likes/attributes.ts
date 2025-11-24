import { DataTypes } from "sequelize";

const likeAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  newsId: {
    type: DataTypes.INTEGER,
    references: {
      model: "news",
      key: "id",
    },
    onDelete: "CASCADE", // 👈 important
    onUpdate: "CASCADE", // 👈 keep FK in sync if news.id changes
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE", // or "SET NULL" depending on your logic
    onUpdate: "CASCADE",
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

export { likeAttributes };
