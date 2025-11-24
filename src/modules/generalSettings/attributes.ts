import { DataTypes } from "sequelize";

const generalSettingAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  key: {
    type: DataTypes.STRING,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  value: {
    type: DataTypes.TEXT("long"),
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  infos: {
    type: DataTypes.JSON,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { generalSettingAttributes };
