import { DataTypes } from "sequelize";

const pollAttributes = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  newsId: {
    type: DataTypes.INTEGER,
    references: { model: "news", key: "id" },
    onDelete: "CASCADE",
  },
  title: { type: DataTypes.JSON, allowNull: false },
  question: { type: DataTypes.JSON, allowNull: false },
  answers: { type: DataTypes.JSON, allowNull: false },

  status: { type: DataTypes.STRING },
  answerBy: { type: DataTypes.JSON },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
};

export { pollAttributes };
