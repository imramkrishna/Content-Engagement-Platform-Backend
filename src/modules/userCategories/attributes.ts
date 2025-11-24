import { DataTypes } from "sequelize";

const tableName = "userCategories";

const attributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  categoryIds: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
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
