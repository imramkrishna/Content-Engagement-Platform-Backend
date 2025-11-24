import { DataTypes } from "sequelize";

const scheduleAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  key: {
    type: DataTypes.STRING,
    unique: true,
  },
  info: {
    type: DataTypes.JSON,
  },
  date: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { scheduleAttributes };
